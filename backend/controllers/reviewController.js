const prisma = require('../config/db');

// @desc    Get all reviews for a restaurant
// @route   GET /api/restaurants/:restaurantId/reviews
// @access  Public
exports.getReviewsByRestaurantId = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const reviews = await prisma.review.findMany({
            where: { restaurantId },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving reviews' });
    }
};

// @desc    Add or update a review for a restaurant
// @route   POST /api/restaurants/:restaurantId/reviews
// @access  Private (CUSTOMER)
exports.addReview = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        // Ensure rating is a valid number between 1 and 5
        const numericRating = Math.max(1, Math.min(5, Number(rating)));

        if (isNaN(numericRating)) {
            return res.status(400).json({ success: false, message: 'Please provide a valid rating' });
        }

        // Upsert review (allows updating an existing review)
        const review = await prisma.review.upsert({
            where: {
                user_restaurant_review: {
                    userId,
                    restaurantId
                }
            },
            update: {
                rating: numericRating,
                comment: comment || null
            },
            create: {
                rating: numericRating,
                comment: comment || null,
                userId,
                restaurantId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true
                    }
                }
            }
        });

        // Recalculate average rating & review count for the restaurant
        const aggregations = await prisma.review.aggregate({
            where: { restaurantId },
            _avg: { rating: true },
            _count: { rating: true }
        });

        const newAverage = aggregations._avg.rating || 0;
        const newCount = aggregations._count.rating || 0;

        await prisma.restaurant.update({
            where: { id: restaurantId },
            data: {
                rating: newAverage,
                reviewCount: newCount
            }
        });

        res.status(201).json({
            success: true,
            message: 'Review successfully submitted',
            data: review,
            restaurantStats: {
                rating: newAverage,
                reviewCount: newCount
            }
        });

    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ success: false, message: 'Server error adding review' });
    }
};
