const express = require('express');
const { getReviewsByRestaurantId, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// mergeParams: true is crucial so we can read :restaurantId from the parent router (restaurants.js)
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getReviewsByRestaurantId)
    .post(protect, addReview); // Only logged in users (customers) can post a review

module.exports = router;
