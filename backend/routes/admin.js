const express = require('express');
const {
    getDashboardStats,
    getAllRestaurants,
    getAllUsers,
    getAllOrders,
    updateRestaurantStatus,
    toggleRestaurantPromotion,
    updateUserStatus,
    deleteRestaurant,
    deleteUser,
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
router.route('/restaurants/:id').delete(deleteRestaurant);

router.route('/users').get(getAllUsers);
router.route('/users/:id/status').patch(updateUserStatus);
router.route('/users/:id').delete(deleteUser);

router.route('/orders').get(getAllOrders);

// WhatsApp Bot Routes
router.route('/whatsapp/settings')
    .get(getWhatsAppSettings)
    .patch(updateWhatsAppSettings);
router.post('/whatsapp/start', startWhatsAppBot);
router.post('/whatsapp/stop', stopWhatsAppBot);
router.post('/whatsapp/reset', resetWhatsAppSession);

module.exports = router;

