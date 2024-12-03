const express = require('express');
const { getReviews, getAllReviews, addReview } = require('../controllers/reviewController');
const router = express.Router();

// Route to fetch all reviews
router.get('/', getAllReviews);

// Route to fetch reviews for a specific placeId
router.get('/:placeId', getReviews);

// Route to add a review for a specific placeId
router.post('/:placeId', addReview);

module.exports = router;
