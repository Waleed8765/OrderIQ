import api from './api';

export const adminService = {
    // Dashboard stats
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },

    // Restaurants
    getAllRestaurants: async (params = {}) => {
        const response = await api.get('/admin/restaurants', { params });
        return response.data;
    },

    updateRestaurantStatus: async (restaurantId, status) => {
        const response = await api.patch(`/admin/restaurants/${restaurantId}/status`, { status });
        return response.data;
    },

    toggleRestaurantPromotion: async (restaurantId, promoted) => {
        const response = await api.patch(`/admin/restaurants/${restaurantId}/promote`, { promoted });
        return response.data;
    },

    // Users
    getAllUsers: async (params = {}) => {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    updateUserStatus: async (userId, isActive) => {
        const response = await api.patch(`/admin/users/${userId}/status`, { isActive });
        return response.data;
    },

    // Orders
    getAllOrders: async (params = {}) => {
        const response = await api.get('/admin/orders', { params });
        return response.data;
    },

    // WhatsApp Settings
    getWhatsAppSettings: async () => {
        const response = await api.get('/admin/whatsapp/settings');
        return response.data;
    },

    updateWhatsAppSettings: async (settings) => {
        const response = await api.patch('/admin/whatsapp/settings', settings);
        return response.data;
    },

    startWhatsAppBot: async () => {
        const response = await api.post('/admin/whatsapp/start');
        return response.data;
    },

    stopWhatsAppBot: async () => {
        const response = await api.post('/admin/whatsapp/stop');
        return response.data;
    },

    resetWhatsAppSession: async () => {
        const response = await api.post('/admin/whatsapp/reset');
        return response.data;
    },
};
