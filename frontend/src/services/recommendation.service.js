import api from './api';

export const recommendationService = {
    getRecommendations: (params = {}) =>
        api.get('/recommendations', { params }).then(res => res.data)
};
