const Review = require('../models/Review');
const axios = require('axios');

exports.getReviews = async (req, res) => {
  const { placeId } = req.params;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  try {
    // Fetch reviews from the Google Places API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`
    );

    if (response.data.status !== 'OK') {
      return res.status(404).json({ error: response.data.error_message || 'Failed to fetch reviews from Google Places.' });
    }

    const reviews = response.data.result.reviews || []; // Extract reviews or return an empty array if no reviews
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews from Google Places API:', error.message);
    res.status(500).json({ message: 'Error fetching reviews from Google Places API.' });
  }
};


exports.addReview = async (req, res) => {
  const { placeId } = req.params;
  const { comment, rating } = req.body;

  if (!comment || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Valid comment and rating (1-5) are required.' });
  }

  try {
    // Validate the place exists using Google Places API
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name&key=${apiKey}`
    );

    if (placeResponse.data.status !== 'OK') {
      return res.status(404).json({ error: 'Place not found. Cannot add review.' });
    }

    // Save the review in the local database
    const newReview = new Review({ restaurantId: placeId, comment, rating });
    const savedReview = await newReview.save();
    res.status(201).json({ message: 'Review posted successfully!', savedReview });
  } catch (error) {
    console.error('Error adding review:', error.message);
    res.status(500).json({ error: 'Failed to add review.' });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find(); // Fetch all reviews from the database
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching all reviews:', error.message);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
};
