const express = require('express');
const multer = require('multer');
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
    addRestaurant,
    getMyRestaurants,
    updateRestaurant,
    getRestaurantsByOwner,
    deleteRestaurant,
    closeRestaurant
} = require('../controllers/businessOwnerController');

const router = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes for Business Owners
router.post('/add', protect, requireRole('BusinessOwner'), upload.array('photos', 5), addRestaurant);
router.get('/my-restaurants', protect, requireRole('BusinessOwner'), getMyRestaurants);
router.put('/update/:id', protect, requireRole(['BusinessOwner', 'Admin']), updateRestaurant);

// Routes for Admins
router.get('/all-restaurants', protect, requireRole('Admin'), async (req, res) => {
    try {
        const restaurants = await Both.find().populate('owner', 'name email');
        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error fetching all restaurants:', error.stack);
        res.status(500).json({ message: 'Failed to fetch restaurants.' });
    }
});
router.get('/restaurants-by-owner/:ownerId', protect, requireRole('Admin'), getRestaurantsByOwner);
router.delete('/delete/:restaurantId', protect, requireRole('Admin'), deleteRestaurant);
router.put('/close/:restaurantId', protect, requireRole('BusinessOwner'), closeRestaurant);


module.exports = router;
