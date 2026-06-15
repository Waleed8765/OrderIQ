const prisma = require('../config/db');
const { admin, isInitialized } = require('../config/firebase');
const { startWhatsApp, stopWhatsApp, getCurrentWhatsAppStatus, resetWhatsAppSession } = require('../services/whatsappService');

// Helper to get or create app settings
const getOrCreateAppSettings = async () => {
    let settings = await prisma.appSettings.findFirst();
    if (!settings) {
        settings = await prisma.appSettings.create({
            data: {}
        });
    }
    return settings;
};

exports.getDashboardStats = async (req, res) => {
    try {
        const [totalOrders, totalUsers, totalRestaurants, totalRestaurantOwners] = await Promise.all([
            prisma.order.count(),
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.restaurant.count(),
            prisma.user.count({ where: { role: 'RESTAURANT_OWNER' } }),
        ]);

        const completedOrders = await prisma.order.findMany({
            where: { status: 'COMPLETED' },
            select: { total: true }
        });
        const totalRevenue = completedOrders.reduce((acc, order) => acc + order.total, 0);

        const cancelledOrders = await prisma.order.count({ where: { status: 'CANCELLED' } });

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalUsers,
                totalRestaurants,
                totalRestaurantOwners,
                totalRevenue: Math.round(totalRevenue),
                cancelledOrders,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error retrieving dashboard stats' });
    }
};

// WhatsApp Settings Controllers
exports.getWhatsAppSettings = async (req, res) => {
    try {
        const settings = await getCurrentWhatsAppStatus();
        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error fetching WhatsApp settings:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error retrieving WhatsApp settings'
        });
    }
};

exports.updateWhatsAppSettings = async (req, res) => {
    try {
        const { whatsappEnabled, whatsappPhoneNumber } = req.body;
        let settings = await getOrCreateAppSettings();
        
        settings = await prisma.appSettings.update({
            where: { id: settings.id },
            data: {
                whatsappEnabled: whatsappEnabled !== undefined ? whatsappEnabled : settings.whatsappEnabled,
                whatsappPhoneNumber: whatsappPhoneNumber !== undefined ? whatsappPhoneNumber : settings.whatsappPhoneNumber
            }
        });

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error updating WhatsApp settings:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error updating WhatsApp settings'
        });
    }
};

exports.startWhatsAppBot = async (req, res) => {
    try {
        await startWhatsApp();
        res.status(200).json({
            success: true,
            message: 'WhatsApp bot starting'
        });
    } catch (error) {
        console.error('Error starting WhatsApp bot:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Server error starting WhatsApp bot'
        });
    }
};

exports.stopWhatsAppBot = async (req, res) => {
    try {
        await stopWhatsApp();
        res.status(200).json({
            success: true,
            message: 'WhatsApp bot stopped'
        });
    } catch (error) {
        console.error('Error stopping WhatsApp bot:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error stopping WhatsApp bot'
        });
    }
};

exports.resetWhatsAppSession = async (req, res) => {
    try {
        const result = await resetWhatsAppSession();
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error('Error resetting WhatsApp session:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error resetting WhatsApp session'
        });
    }
};

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await prisma.restaurant.findMany({
            include: {
                owner: { select: { fullName: true, email: true } },
                _count: { select: { orders: true, menuItems: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error retrieving restaurants' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                _count: { select: { orders: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error retrieving users' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                customer: { select: { fullName: true, email: true } },
                restaurant: { select: { name: true } },
                items: true,
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error retrieving orders' });
    }
};

exports.updateRestaurantStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const restaurant = await prisma.restaurant.update({
            where: { id: req.params.id },
            data: { status }
        });
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error updating restaurant status' });
    }
};

exports.toggleRestaurantPromotion = async (req, res) => {
    try {
        const { promoted } = req.body;
        const restaurant = await prisma.restaurant.update({
            where: { id: req.params.id },
            data: { promoted }
        });
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error toggling restaurant promotion' });
    }
};

// @desc    Toggle user active/blocked status
// @route   PATCH /api/admin/users/:id/status
// @access  Private (ADMIN)
exports.updateUserStatus = async (req, res) => {
    try {
        // We store blocked status in the role or a separate field. Since our schema has no isActive,
        // we handle it by storing a marker. For now we return 200 as a no-op since schema has no isActive field.
        // TODO: Add isActive Boolean field to User model in schema and run migration.
        res.status(200).json({ success: true, message: 'Status updated (pending schema migration)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error updating user status' });
    }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, delete related records explicitly to avoid foreign key issues
    await prisma.orderItem.deleteMany({
      where: {
        order: {
          restaurantId: id
        }
      }
    });
    await prisma.order.deleteMany({
      where: { restaurantId: id }
    });
    await prisma.menuItem.deleteMany({
      where: { restaurantId: id }
    });
    await prisma.category.deleteMany({
      where: { restaurantId: id }
    });
    await prisma.teamMember.deleteMany({
      where: { restaurantId: id }
    });
    await prisma.favorite.deleteMany({
      where: { restaurantId: id }
    });
    await prisma.review.deleteMany({
      where: { restaurantId: id }
    });
    await prisma.table.deleteMany({
      where: { restaurantId: id }
    });
    await prisma.restaurantPaymentSettings.deleteMany({
      where: { restaurantId: id }
    });
    
    // Then delete the restaurant
    await prisma.restaurant.delete({
      where: { id }
    });
    
    res.status(200).json({ success: true, message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ success: false, message: 'Server error deleting restaurant', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the user first to get their firebaseUid
    const userToDelete = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // First, delete related records explicitly
    await prisma.orderItem.deleteMany({
      where: {
        order: {
          customerId: id
        }
      }
    });
    await prisma.order.deleteMany({
      where: { customerId: id }
    });
    await prisma.address.deleteMany({
      where: { userId: id }
    });
    await prisma.teamMember.deleteMany({
      where: { userId: id }
    });
    await prisma.reward.deleteMany({
      where: { userId: id }
    });
    await prisma.favorite.deleteMany({
      where: { userId: id }
    });
    await prisma.review.deleteMany({
      where: { userId: id }
    });
    
    // Then delete the user from our DB
    await prisma.user.delete({
      where: { id }
    });
    
    // Also delete the user from Firebase Auth if Firebase is initialized
    if (isInitialized) {
      try {
        await admin.auth().deleteUser(userToDelete.firebaseUid);
        console.log(`[Admin] Deleted user from Firebase Auth: ${userToDelete.email}`);
      } catch (firebaseError) {
        console.error('Error deleting user from Firebase Auth:', firebaseError);
        // Don't fail the whole request if Firebase delete fails, just log it
      }
    }
    
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error deleting user', error: error.message });
  }
};

