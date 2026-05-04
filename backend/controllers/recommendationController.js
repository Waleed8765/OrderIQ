const prisma = require('../config/db');
const { getRecommendations } = require('../services/recommendationService');

// @desc    Get personalized restaurant recommendations for the logged-in customer
// @route   GET /api/recommendations
// @access  Private (CUSTOMER)
exports.getRecommendations = async (req, res) => {
    try {
        const { type, limit, offset } = req.query;
        let { city } = req.query;

        // Resolve city: explicit query param → user's default address → no filter
        if (!city) {
            const defaultAddr = await prisma.address.findFirst({
                where: { userId: req.user.id, isDefault: true },
                select: { city: true }
            });
            city = defaultAddr?.city || null;
        }

        const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 8, 1), 20);
        const pageOffset = Math.max(parseInt(offset, 10) || 0, 0);

        const result = await getRecommendations({
            userId: req.user.id,
            city,
            type: type || null,
            offset: pageOffset,
            limit: pageLimit
        });

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('[Recommendations] Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching recommendations' });
    }
};
