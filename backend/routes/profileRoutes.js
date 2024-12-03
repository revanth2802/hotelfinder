const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get profile
router.get('/profile', protect, getProfile);

// Route to update profile
router.put('/profile', protect, updateProfile);

module.exports = router;
