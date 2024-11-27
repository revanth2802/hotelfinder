const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Ensure this is set in your .env file

// Proxy route to fetch restaurant details from Google Places API
router.get('/google-details/:placeId', async (req, res) => {
  const { placeId } = req.params;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
    );

    res.status(200).json(response.data); // Send the Google API response to the frontend
  } catch (error) {
    console.error('Error fetching Google Places details:', error.message);
    res.status(500).json({ error: 'Failed to fetch restaurant details' });
  }
});

module.exports = router;
