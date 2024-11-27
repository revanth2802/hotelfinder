const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/fetch', async (req, res) => {
  const { location, radius = 5000, type = 'restaurant' } = req.body;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;
    const response = await axios.get(url);

    // Extract relevant data
    const restaurants = response.data.results.map((place) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity || '',
      categories: place.types || [],
      priceRange: place.price_level ? ['Low', 'Medium', 'High'][place.price_level - 1] : 'Medium',
      ratings: place.rating || 0,
      reviewCount: place.user_ratings_total || 0,
      imageUrl: place.photos
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=640&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
        : 'https://via.placeholder.com/640x480',
    }));

    res.json(restaurants); // Send data directly to frontend
  } catch (error) {
    console.error('Error fetching Google Places data:', error.message);
    res.status(500).json({ error: 'Failed to fetch Google Places data' });
  }
});

module.exports = router;
