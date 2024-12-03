const express = require('express');
const { registerUser, loginUser, getUserDetails, protect } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', protect, getUserDetails);

module.exports = router;
