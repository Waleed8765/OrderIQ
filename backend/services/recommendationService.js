const prisma = require('../config/db');
const { buildRestaurantSearchWhere } = require('../utils/restaurantSearch');
const { recommendRestaurantsWithAI } = require('./aiRecommendationClient');
const recommendationCache = new Map();
const CACHE_TTL_MS = Number(process.env.AI_RECOMMENDATION_CACHE_TTL_MS || 120000);
/** Max restaurants kept in the ranked list (pagination slices from this). */
function getMaxRecoItems() {
    const n = Number(process.env.AI_RECOMMENDATION_MAX_ITEMS || 60);
    if (Number.isNaN(n)) return 60;
    return Math.min(150, Math.max(8, Math.floor(n)));
}
/** Top-N heuristic candidates sent to the LLM (smaller = faster, fewer tokens). */
function getAiCandidatePoolSize() {
    const n = Number(process.env.AI_RECOMMENDATION_CANDIDATE_POOL || 12);
    if (Number.isNaN(n)) return 12;
    return Math.min(30, Math.max(5, Math.floor(n)));
}
const DEFAULT_AI_TIMEOUT_MS = 8000;

function buildPagedResponse(fullRestaurants, meta, offset, limit) {
    const total = fullRestaurants.length;
    const slice = fullRestaurants.slice(offset, offset + limit);
    return {
        restaurants: slice,
        total,
        hasMore: offset + limit < total,
        offset,
        limit,
        ...meta,
    };
}

/**
 * Hybrid recommendation engine:
 * - Personalized: cuisine overlap + rating quality + favorite/novelty signals (when order history exists)
 * - Popular area: favorite-boosted + rating-sorted (no orders, has city or favorites)
 * - Cold start: promoted first, then rating quality (brand-new users)
 */
async function getRecommendations(
    { userId, city, type, offset = 0, limit = 10, search = null, cuisine = null },
    deps = {}
) {
    const db = deps.prisma || prisma;
    const aiRecommend = deps.aiRecommend || recommendRestaurantsWithAI;
    const bypassCache = Boolean(deps.bypassCache);
    const safeOffset = Math.max(0, Number(offset) || 0);
    const safeLimit = Math.max(1, Number(limit) || 10);
    const maxItems = getMaxRecoItems();
    const cacheKey = JSON.stringify({
        userId: userId || 'guest',
        city: city || null,
        type: type || null,
        search: search || null,
        cuisine: cuisine || null,
    });
    if (!bypassCache) {
        const cached = recommendationCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
            return buildPagedResponse(cached.fullRestaurants, cached.meta, safeOffset, safeLimit);
        }
    }
    const whereClause = {};

    const searchWhere = buildRestaurantSearchWhere(search);
    if (searchWhere) {
        Object.assign(whereClause, searchWhere);
    }

    if (cuisine) {
        whereClause.cuisineTypes = { has: cuisine };
    }

    if (city) {
        whereClause.city = { equals: city, mode: 'insensitive' };
    }

    if (type === 'delivery') whereClause.delivery = true;
    else if (type === 'pickup') whereClause.takeaway = true;
    else if (type === 'dinein') whereClause.dineIn = true;

    // Fetch all candidates (cap at 150 to keep in-memory scoring fast)
    const candidates = await db.restaurant.findMany({
        where: whereClause,
        take: 150
    });

    if (candidates.length === 0) {
        return buildPagedResponse([], { scenario: 'cold_start', source: 'heuristic' }, safeOffset, safeLimit);
    }

    // Fetch user behavioral signals in parallel (guests: no history)
    const [recentOrders, userFavorites] = userId
        ? await Promise.all([
            db.order.findMany({
                where: { customerId: userId },
                orderBy: { createdAt: 'desc' },
                take: 20,
                select: {
                    restaurantId: true,
                    createdAt: true,
                    restaurant: { select: { cuisineTypes: true } }
                }
            }),
            db.favorite.findMany({
                where: { userId },
                select: { restaurantId: true }
            })
        ])
        : [[], []];

    const favoriteIds = new Set(userFavorites.map(f => f.restaurantId));
    const hasOrderHistory = recentOrders.length > 0;
    const hasFavorites = favoriteIds.size > 0;

    // Determine rail label scenario
    let scenario;
    if (hasOrderHistory) scenario = 'personalized';
    else if (city) scenario = 'popular_area';
    else scenario = 'cold_start';

    // Cold start: no behavioral data — return promoted + highest rated
    if (!hasOrderHistory && !hasFavorites) {
        const sorted = [...candidates].sort((a, b) => {
            if (a.promoted !== b.promoted) return (b.promoted ? 1 : 0) - (a.promoted ? 1 : 0);
            const scoreA = (a.rating / 5) * Math.log(2 + a.reviewCount);
            const scoreB = (b.rating / 5) * Math.log(2 + b.reviewCount);
            return scoreB - scoreA;
        });
        const fullRestaurants = sorted.slice(0, Math.min(maxItems, sorted.length));
        const meta = { scenario, source: 'heuristic' };
        if (!bypassCache) recommendationCache.set(cacheKey, { timestamp: Date.now(), fullRestaurants, meta });
        return buildPagedResponse(fullRestaurants, meta, safeOffset, safeLimit);
    }

    // Build cuisine frequency map from order history
    const cuisineFreq = {};
    for (const order of recentOrders) {
        for (const cuisine of (order.restaurant?.cuisineTypes || [])) {
            cuisineFreq[cuisine] = (cuisineFreq[cuisine] || 0) + 1;
        }
    }

    // Top 5 user cuisines by order frequency
    const topCuisines = Object.entries(cuisineFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cuisine]) => cuisine);

    // Track which restaurants were ordered from, and which recently (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const orderedRestaurantIds = new Set(recentOrders.map(o => o.restaurantId));
    const recentRestaurantIds = new Set(
        recentOrders
            .filter(o => new Date(o.createdAt) > sevenDaysAgo)
            .map(o => o.restaurantId)
    );

    const scored = candidates.map(r => {
        let score = 0;

        // Cuisine overlap score (0–3.0) — core personalization signal
        if (topCuisines.length > 0) {
            const overlap = (r.cuisineTypes || []).filter(c => topCuisines.includes(c)).length;
            score += (overlap / topCuisines.length) * 3.0;
        }

        // Rating quality score (0–1.5) — log(2+n) prevents zeroing new restaurants
        score += (r.rating / 5) * (Math.log(2 + r.reviewCount) / Math.log(1002)) * 1.5;

        // Explicit signals
        if (favoriteIds.has(r.id)) score += 2.0;
        if (r.promoted) score += 0.5;

        // Novelty: gentle boost for places the user has never ordered from
        if (!orderedRestaurantIds.has(r.id)) score += 0.3;

        // Recency penalty: suppress recently visited restaurants to encourage variety
        if (recentRestaurantIds.has(r.id)) score -= 0.4;

        return { restaurant: r, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const fullHeuristicList = scored.slice(0, Math.min(maxItems, scored.length)).map(s => s.restaurant);
    const canUseAI = hasOrderHistory || hasFavorites;

    if (!canUseAI) {
        const meta = { scenario, source: 'heuristic' };
        if (!bypassCache) recommendationCache.set(cacheKey, { timestamp: Date.now(), fullRestaurants: fullHeuristicList, meta });
        return buildPagedResponse(fullHeuristicList, meta, safeOffset, safeLimit);
    }

    const poolSize = getAiCandidatePoolSize();
    const aiCandidatePool = scored.slice(0, Math.min(poolSize, scored.length)).map(s => s.restaurant);
    const userProfile = {
        topCuisines,
        favoriteRestaurantIds: Array.from(favoriteIds),
        recentlyOrderedRestaurantIds: Array.from(recentRestaurantIds),
        city: city || null,
        type: type || null
    };

    const timeoutRaw = Number(process.env.AI_RECOMMENDATION_TIMEOUT_MS);
    const timeoutMs = Number.isFinite(timeoutRaw) && timeoutRaw > 0
        ? timeoutRaw
        : DEFAULT_AI_TIMEOUT_MS;

    const aiRankLimit = Math.min(aiCandidatePool.length, poolSize);

    try {
        const aiResponseRaw = await Promise.race([
            aiRecommend({
                userProfile,
                candidates: aiCandidatePool,
                limit: aiRankLimit,
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('AI recommendation timeout')), timeoutMs)
            )
        ]);

        const aiResponse = Array.isArray(aiResponseRaw)
            ? { recommendations: aiResponseRaw, provider: 'unknown', model: 'unknown' }
            : aiResponseRaw;

        if (!Array.isArray(aiResponse?.recommendations) || aiResponse.recommendations.length === 0) {
            throw new Error('AI recommendation returned no usable items');
        }

        const reasonById = new Map(aiResponse.recommendations.map(item => [item.restaurantId, item.reason]));
        const aiRanked = aiResponse.recommendations
            .map(item => aiCandidatePool.find(r => r.id === item.restaurantId))
            .filter(Boolean)
            .map(r => ({ ...r, aiReason: reasonById.get(r.id) }));

        const selectedIds = new Set(aiRanked.map(r => r.id));
        const tailFromScores = scored
            .map(s => s.restaurant)
            .filter(r => !selectedIds.has(r.id));
        const merged = [...aiRanked, ...tailFromScores].slice(0, Math.min(maxItems, candidates.length));

        const meta = {
            scenario: 'ai_personalized',
            source: 'ai',
            aiProvider: aiResponse.provider || 'unknown',
            aiModel: aiResponse.model || 'unknown',
        };
        if (!bypassCache) recommendationCache.set(cacheKey, { timestamp: Date.now(), fullRestaurants: merged, meta });
        return buildPagedResponse(merged, meta, safeOffset, safeLimit);
    } catch (error) {
        console.warn('[Recommendations] AI ranking failed, using heuristic fallback:', error.message);
        const meta = {
            scenario: `${scenario}_fallback`,
            source: 'heuristic',
            fallbackReason: error.message,
        };
        if (!bypassCache) recommendationCache.set(cacheKey, { timestamp: Date.now(), fullRestaurants: fullHeuristicList, meta });
        return buildPagedResponse(fullHeuristicList, meta, safeOffset, safeLimit);
    }

}

module.exports = { getRecommendations };
