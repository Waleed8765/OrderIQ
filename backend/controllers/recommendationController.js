const prisma = require('../config/db');
const { getRecommendations } = require('../services/recommendationService');

// @desc    Get personalized restaurant recommendations for the logged-in customer
// @route   GET /api/recommendations
// @access  Private (CUSTOMER)
exports.getRecommendations = async (req, res) => {
    try {
        const { type, limit } = req.query;
        let { city } = req.query;

        // Resolve city: explicit query param → user's default address → no filter
        if (!city) {
            const defaultAddr = await prisma.address.findFirst({
                where: { userId: req.user.id, isDefault: true },
                select: { city: true }
            });
            city = defaultAddr?.city || null;
        }

        const result = await getRecommendations({
            userId: req.user.id,
            city,
            type: type || null,
            limit: Math.min(parseInt(limit, 10) || 10, 20)
        });

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('[Recommendations] Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching recommendations' });
    }
};
