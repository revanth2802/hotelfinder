const express = require('express');
const { protect, requireRole } = require('../middleware/authMiddleware');
const User = require('../models/User');


const router = express.Router();

// Fetch all users
router.get('/users', protect, requireRole('Admin'), async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password for security
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});


module.exports = router;
