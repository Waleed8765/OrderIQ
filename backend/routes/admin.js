const express = require('express');
const {
    getDashboardStats,
    getAllRestaurants,
    getAllUsers,
    getAllOrders,
    updateRestaurantStatus,
    toggleRestaurantPromotion,
    updateUserStatus,
    getWhatsAppSettings,
    updateWhatsAppSettings,
    startWhatsAppBot,
    stopWhatsAppBot,
    resetWhatsAppSession,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboardStats);

router.route('/restaurants').get(getAllRestaurants);
router.route('/restaurants/:id/status').patch(updateRestaurantStatus);
router.route('/restaurants/:id/promote').patch(toggleRestaurantPromotion);

router.route('/users').get(getAllUsers);
router.route('/users/:id/status').patch(updateUserStatus);

router.route('/orders').get(getAllOrders);

// WhatsApp Bot Routes
router.route('/whatsapp/settings')
    .get(getWhatsAppSettings)
    .patch(updateWhatsAppSettings);
router.post('/whatsapp/start', startWhatsAppBot);
router.post('/whatsapp/stop', stopWhatsAppBot);
router.post('/whatsapp/reset', resetWhatsAppSession);

module.exports = router;

