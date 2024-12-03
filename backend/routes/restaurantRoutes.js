const express = require('express');
const { getRestaurantDetails } = require('../controllers/restaurantController');
const router = express.Router();

router.get('/google-details/:placeId', getRestaurantDetails);

module.exports = router;
