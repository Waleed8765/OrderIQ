const test = require('node:test');
const assert = require('node:assert/strict');

const { getRecommendations } = require('../services/recommendationService');

function createFakePrisma({ restaurants, orders, favorites }) {
    return {
        restaurant: {
            findMany: async () => restaurants,
        },
        order: {
            findMany: async () => orders,
        },
        favorite: {
            findMany: async () => favorites,
        },
    };
}

function sampleData() {
    const restaurants = [
        {
            id: 'r1',
            name: 'Spice House',
            city: 'Lahore',
            cuisineTypes: ['Pakistani', 'BBQ'],
            rating: 4.8,
            reviewCount: 120,
            promoted: false,
            priceRange: '$$',
        },
        {
            id: 'r2',
            name: 'Burger Spot',
            city: 'Lahore',
            cuisineTypes: ['Fast Food'],
            rating: 4.5,
            reviewCount: 80,
            promoted: true,
            priceRange: '$$',
        },
        {
            id: 'r3',
            name: 'Rice Bowl',
            city: 'Lahore',
            cuisineTypes: ['Pakistani'],
            rating: 4.3,
            reviewCount: 40,
            promoted: false,
            priceRange: '$',
        },
    ];

    const orders = [
        {
            restaurantId: 'r1',
            createdAt: new Date().toISOString(),
            restaurant: { cuisineTypes: ['Pakistani', 'BBQ'] },
        },
    ];

    const favorites = [{ restaurantId: 'r2' }];

    return { restaurants, orders, favorites };
}

test('returns ai_personalized with aiReason when AI succeeds', async () => {
    const { restaurants, orders, favorites } = sampleData();
    const fakePrisma = createFakePrisma({ restaurants, orders, favorites });

    const result = await getRecommendations(
        { userId: 'u1', city: 'Lahore', type: null, limit: 2 },
        {
            prisma: fakePrisma,
            bypassCache: true,
            aiRecommend: async () => ({
                recommendations: [
                    { restaurantId: 'r2', reason: 'You frequently favorite similar fast-food places.' },
                    { restaurantId: 'r1', reason: 'You recently ordered Pakistani BBQ cuisine.' },
                ],
                provider: 'groq',
                model: 'llama-3.3-70b-versatile',
            }),
        }
    );

    assert.equal(result.scenario, 'ai_personalized');
    assert.equal(result.source, 'ai');
    assert.equal(result.aiProvider, 'groq');
    assert.equal(result.restaurants.length, 2);
    assert.equal(result.restaurants[0].id, 'r2');
    assert.ok(result.restaurants[0].aiReason);
    assert.equal(result.total, 3);
    assert.equal(result.hasMore, true);
    assert.equal(result.offset, 0);
    assert.equal(result.limit, 2);
});

test('falls back to heuristic when AI throws', async () => {
    const { restaurants, orders, favorites } = sampleData();
    const fakePrisma = createFakePrisma({ restaurants, orders, favorites });

    const result = await getRecommendations(
        { userId: 'u1', city: 'Lahore', type: null, limit: 2 },
        {
            prisma: fakePrisma,
            bypassCache: true,
            aiRecommend: async () => {
                throw new Error('AI provider unavailable');
            },
        }
    );

    assert.equal(result.scenario, 'personalized_fallback');
    assert.equal(result.source, 'heuristic');
    assert.equal(result.restaurants.length, 2);
    assert.equal(result.hasMore, true);
});

test('falls back to heuristic when AI returns empty list', async () => {
    const { restaurants, orders, favorites } = sampleData();
    const fakePrisma = createFakePrisma({ restaurants, orders, favorites });

    const result = await getRecommendations(
        { userId: 'u1', city: 'Lahore', type: null, limit: 2 },
        {
            prisma: fakePrisma,
            bypassCache: true,
            aiRecommend: async () => [],
        }
    );

    assert.equal(result.scenario, 'personalized_fallback');
    assert.equal(result.source, 'heuristic');
    assert.equal(result.restaurants.length, 2);
    assert.equal(result.hasMore, true);
});

test('guest (no userId) uses cold-start heuristic ranking', async () => {
    const { restaurants, orders, favorites } = sampleData();
    const fakePrisma = createFakePrisma({
        restaurants,
        orders: [],
        favorites: [],
    });

    const result = await getRecommendations(
        { userId: null, city: 'Lahore', type: null, offset: 0, limit: 5 },
        { prisma: fakePrisma, bypassCache: true }
    );

    assert.equal(result.source, 'heuristic');
    assert.ok(result.restaurants.length >= 1);
    assert.equal(result.scenario, 'popular_area');
});

test('second page returns remaining restaurants', async () => {
    const { restaurants, orders, favorites } = sampleData();
    const fakePrisma = createFakePrisma({ restaurants, orders, favorites });

    const page2 = await getRecommendations(
        { userId: 'u1', city: 'Lahore', type: null, offset: 2, limit: 2 },
        {
            prisma: fakePrisma,
            bypassCache: true,
            aiRecommend: async () => ({
                recommendations: [
                    { restaurantId: 'r2', reason: 'Favorites.' },
                    { restaurantId: 'r1', reason: 'Orders.' },
                ],
                provider: 'groq',
                model: 'llama-3.3-70b-versatile',
            }),
        }
    );

    assert.equal(page2.offset, 2);
    assert.equal(page2.restaurants.length, 1);
    assert.equal(page2.restaurants[0].id, 'r3');
    assert.equal(page2.hasMore, false);
});

