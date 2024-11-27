// routes/reviewfetchRoutes.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); // Assuming you have a Review model

// Fetch real-time reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(12); // Fetch the latest 12 reviews
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
