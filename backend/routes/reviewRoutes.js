// routes/reviewRoutes.js
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

router.post('/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params; // Extract restaurantId
  const { comment, rating } = req.body; // Extract review details

  if (!comment || !rating) {
    return res.status(400).json({ error: 'Comment and rating are required.' });
  }

  try {
    // Fetch restaurant details from Google Places API
    const googleResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurantId}&key=${GOOGLE_API_KEY}`
    );

    if (googleResponse.data.status !== 'OK') {
      return res.status(404).json({ error: 'Restaurant not found in Google API.' });
    }

    const restaurantDetails = googleResponse.data.result;

    // Save the review in the database
    const newReview = new Review({
      restaurantId,
      comment,
      rating,
      createdAt: new Date(),
    });

    const savedReview = await newReview.save();

    res.status(201).json({
      message: 'Review posted successfully!',
      restaurantDetails, // Include Google API details for the frontend
      savedReview,       // Include the saved review
    });
  } catch (error) {
    console.error('Error posting review or fetching Google data:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
