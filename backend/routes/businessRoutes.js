const express = require('express');
const { addRestaurant, updateRestaurant, viewListings } = require('../controllers/businessController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect, requireRole('BusinessOwner'));

router.post('/add', addRestaurant);
router.put('/update/:id', updateRestaurant);
router.get('/listings', viewListings);

module.exports = router;
