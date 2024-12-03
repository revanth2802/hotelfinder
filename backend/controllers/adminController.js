const express = require('express');
const { protect, requireRole } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Fetch all users
router.get('/users', protect, requireRole('Admin'), async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password field for security
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

exports.getRestaurantsByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;

        if (!ownerId) {
            return res.status(400).json({ message: 'Owner ID is required.' });
        }

        const restaurants = await Both.find({ owner: ownerId });

        if (!restaurants.length) {
            return res.status(404).json({ message: 'No restaurants found for this owner.' });
        }

        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants by owner ID:', error.message);
        res.status(500).json({ message: 'Failed to fetch restaurants.' });
    }
};

module.exports = router;
