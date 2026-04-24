const prisma = require('../config/db');

/**
 * Hybrid recommendation engine:
 * - Personalized: cuisine overlap + rating quality + favorite/novelty signals (when order history exists)
 * - Popular area: favorite-boosted + rating-sorted (no orders, has city or favorites)
 * - Cold start: promoted first, then rating quality (brand-new users)
 */
async function getRecommendations({ userId, city, type, limit = 10 }) {
    const whereClause = {};

    if (city) {
        whereClause.city = { equals: city, mode: 'insensitive' };
    }

    if (type === 'delivery') whereClause.delivery = true;
    else if (type === 'pickup') whereClause.takeaway = true;
    else if (type === 'dinein') whereClause.dineIn = true;

    // Fetch all candidates (cap at 150 to keep in-memory scoring fast)
    const candidates = await prisma.restaurant.findMany({
        where: whereClause,
        take: 150
    });

    if (candidates.length === 0) {
        return { restaurants: [], scenario: 'cold_start' };
    }

    // Fetch user behavioral signals in parallel
    const [recentOrders, userFavorites] = await Promise.all([
        prisma.order.findMany({
            where: { customerId: userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: {
                restaurantId: true,
                createdAt: true,
                restaurant: { select: { cuisineTypes: true } }
            }
        }),
        prisma.favorite.findMany({
            where: { userId },
            select: { restaurantId: true }
        })
    ]);

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
        return { restaurants: sorted.slice(0, limit), scenario };
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

    return {
        restaurants: scored.slice(0, limit).map(s => s.restaurant),
        scenario
    };
}

module.exports = { getRecommendations };
