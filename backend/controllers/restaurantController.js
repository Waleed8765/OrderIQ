const prisma = require('../config/db');
const ragSync = require('../rag').sync;
const { getRecommendations } = require('../services/recommendationService');
const { buildRestaurantSearchWhere } = require('../utils/restaurantSearch');
const listCache = new Map();

const isTransientDbError = (error) => {
    if (!error) return false;
    const code = error.code || error.errorCode;
    const message = String(error.message || '');
    return code === 'P1001' || message.includes("Can't reach database server");
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// @desc    Get all active restaurants with optional filters
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = async (req, res) => {
    let cacheKey = null;
    try {
        const { search, cuisine, type, sort, page, limit } = req.query;

        const whereClause = {}; // Fetch all restaurants to show correct closed status

        console.log('[DEBUG] Query Params:', req.query);

        const searchWhere = buildRestaurantSearchWhere(search);
        if (searchWhere) {
            Object.assign(whereClause, searchWhere);
        }

        if (cuisine) {
            whereClause.cuisineTypes = { has: cuisine };
        }

        if (type) {
            if (type === 'delivery') whereClause.delivery = true;
            if (type === 'pickup') whereClause.takeaway = true;
            if (type === 'dinein') whereClause.dineIn = true;
        }

        console.log('[DEBUG] Where Clause:', whereClause);

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 12;
        const skip = (pageNum - 1) * limitNum;

        // Recommended = same hybrid engine as /api/recommendations (guests: promoted + ratings; logged-in: personalized + optional AI)
        if (sort === 'recommended') {
            let cityReco = req.query.city;
            if (!cityReco && req.user?.id) {
                const defaultAddr = await prisma.address.findFirst({
                    where: { userId: req.user.id, isDefault: true },
                    select: { city: true }
                });
                cityReco = defaultAddr?.city || null;
            }

            const reco = await getRecommendations({
                userId: req.user?.id || null,
                city: cityReco,
                type: type || null,
                search: search || null,
                cuisine: cuisine || null,
                offset: skip,
                limit: limitNum
            });

            const ids = reco.restaurants.map((r) => r.id);
            let restaurants = [];
            if (ids.length > 0) {
                const withCat = await prisma.restaurant.findMany({
                    where: { id: { in: ids } },
                    include: { categories: { select: { id: true } } }
                });
                const byId = new Map(withCat.map((r) => [r.id, r]));
                restaurants = ids.map((id) => byId.get(id)).filter(Boolean);
            }

            const total = reco.total;
            return res.status(200).json({
                success: true,
                count: restaurants.length,
                total,
                page: pageNum,
                pages: Math.max(1, Math.ceil(total / limitNum)),
                data: restaurants
            });
        }

        let orderBy = {};
        if (sort === 'rating') {
            orderBy = { rating: 'desc' };
        } else if (sort === 'fastest') {
            orderBy = { prepTime: 'asc' };
        } else if (sort === 'price') {
            orderBy = { deliveryFee: 'asc' }; // Or some price property
        } else {
            orderBy = { createdAt: 'desc' }; // fallback
        }

        cacheKey = JSON.stringify({ whereClause, orderBy, pageNum, limitNum });

        const runRestaurantQuery = () =>
            prisma.$transaction([
                prisma.restaurant.count({ where: whereClause }),
                prisma.restaurant.findMany({
                    where: whereClause,
                    orderBy: orderBy,
                    include: {
                        categories: { select: { id: true } }
                    },
                    skip,
                    take: limitNum
                })
            ]);

        let total;
        let restaurants;
        try {
            [total, restaurants] = await runRestaurantQuery();
        } catch (firstError) {
            if (!isTransientDbError(firstError)) throw firstError;
            console.warn('[Restaurants] transient DB error, retrying once:', firstError.message);
            await wait(250);
            [total, restaurants] = await runRestaurantQuery();
        }

        listCache.set(cacheKey, {
            total,
            restaurants,
            pageNum,
            limitNum,
            cachedAt: Date.now()
        });

        res.status(200).json({ 
            success: true, 
            count: restaurants.length, 
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: restaurants 
        });
    } catch (error) {
        console.error('[Restaurants] failed to retrieve list:', error);
        if (isTransientDbError(error)) {
            const cached = cacheKey ? listCache.get(cacheKey) : null;
            if (cached) {
                return res.status(200).json({
                    success: true,
                    stale: true,
                    message: 'Showing cached restaurants because the database is temporarily unavailable.',
                    count: cached.restaurants.length,
                    total: cached.total,
                    page: cached.pageNum,
                    pages: Math.ceil(cached.total / cached.limitNum),
                    data: cached.restaurants
                });
            }
            return res.status(503).json({
                success: false,
                message: 'Restaurant service is temporarily unavailable. Please retry in a moment.'
            });
        }
        res.status(500).json({ success: false, message: 'Server error retrieving restaurants' });
    }
};

// @desc    Get single restaurant by ID including categories and active menu items
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: req.params.id },
            include: {
                categories: {
                    where: { visible: true },
                    orderBy: { sortOrder: 'asc' },
                    include: {
                        menuItems: {
                            where: { inStock: true }
                        }
                    }
                },
                paymentSettings: true   // Expose to checkout page
            }
        });

        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }

        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error retrieving restaurant' });
    }
};

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private (RESTAURANT_OWNER)
exports.createRestaurant = async (req, res) => {
    try {
        // Add owner ID from the JWT token
        req.body.ownerId = req.user.id;

        // Optional arrays formatting
        if (req.body.cuisineTypes && typeof req.body.cuisineTypes === 'string') {
            req.body.cuisineTypes = req.body.cuisineTypes.split(',').map(c => c.trim());
        }

        const restaurant = await prisma.restaurant.create({
            data: req.body
        });

        // Sync RAG embedding (non-blocking)
        ragSync.syncRestaurantEmbedding(restaurant.id).catch(e => console.error('[RAG Sync] Failed to embed restaurant:', e.message));

        res.status(201).json({ success: true, data: restaurant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error creating restaurant' });
    }
};

// @desc    Update restaurant details
// @route   PUT /api/restaurants/:id
// @access  Private (RESTAURANT_OWNER / Admin)
exports.updateRestaurant = async (req, res) => {
    try {
        let restaurant = await prisma.restaurant.findUnique({ where: { id: req.params.id } });
        if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
        if (restaurant.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this restaurant' });
        }
        // Whitelist only valid Restaurant schema fields to avoid Prisma errors
        const {
            name, businessType, description, address, city, area,
            logo, coverImage, openingTime, closingTime, status,
            delivery, dineIn, takeaway, deliveryFee, priceRange, cuisineTypes, prepTime, schedule
        } = req.body;
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (businessType !== undefined) updateData.businessType = businessType;
        if (description !== undefined) updateData.description = description;
        if (address !== undefined) updateData.address = address;
        if (city !== undefined) updateData.city = city;
        if (area !== undefined) updateData.area = area;
        if (logo !== undefined) updateData.logo = logo;
        if (coverImage !== undefined) updateData.coverImage = coverImage;
        if (openingTime !== undefined) updateData.openingTime = openingTime;
        if (closingTime !== undefined) updateData.closingTime = closingTime;
        if (status !== undefined) updateData.status = status;
        if (delivery !== undefined) updateData.delivery = delivery;
        if (dineIn !== undefined) updateData.dineIn = dineIn;
        if (takeaway !== undefined) updateData.takeaway = takeaway;
        if (deliveryFee !== undefined) updateData.deliveryFee = parseFloat(deliveryFee);
        if (priceRange !== undefined) updateData.priceRange = priceRange;
        if (prepTime !== undefined) updateData.prepTime = parseInt(prepTime);
        if (schedule !== undefined) updateData.schedule = schedule;
        if (cuisineTypes !== undefined) {
            updateData.cuisineTypes = typeof cuisineTypes === 'string'
                ? cuisineTypes.split(',').map(c => c.trim())
                : cuisineTypes;
        }
        restaurant = await prisma.restaurant.update({
            where: { id: req.params.id },
            data: updateData,
        });

        // Sync RAG embedding (non-blocking)
        ragSync.syncRestaurantEmbedding(restaurant.id).catch(e => console.error('[RAG Sync] Failed to embed restaurant:', e.message));

        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error updating restaurant' });
    }
};

// @desc    Get logged-in owner's restaurants
// @route   GET /api/restaurants/mine
// @access  Private (RESTAURANT_OWNER)
exports.getMyRestaurants = async (req, res) => {
    try {
        // Find restaurants where user is owner or part of team
        const restaurants = await prisma.restaurant.findMany({
            where: {
                OR: [
                    { ownerId: req.user.id },
                    { teamMembers: { some: { userId: req.user.id } } }
                ]
            },
            include: {
                categories: true
            }
        });

        res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error retrieving your restaurants' });
    }
};