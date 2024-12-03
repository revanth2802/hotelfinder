const express = require('express');
const { fetchRestaurants} = require('../controllers/placesController');
const router = express.Router();

router.post('/fetch', fetchRestaurants);


module.exports = router;
