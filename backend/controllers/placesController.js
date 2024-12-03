const axios = require('axios');

// Fetch restaurants from Google Places API
exports.fetchRestaurants = async (req, res) => {
  const { location, radius = 5000, type = 'restaurant' } = req.body;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  try {
    if (!location) {
      return res.status(400).json({ error: 'Location is required.' });
    }

    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;
    console.log('Requesting API:', apiUrl);

    const response = await axios.get(apiUrl);

    if (!response.data.results || response.data.results.length === 0) {
      return res.status(404).json({ error: 'No restaurants found in the specified area.' });
    }

    const restaurants = response.data.results.map((place) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity || '',
      categories: place.types || [],
      rating: place.rating || 0,
      reviewsCount: place.user_ratings_total || 0,
      imageUrl: place.photos
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=640&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
        : 'https://via.placeholder.com/640x480',
    }));

    console.log('Fetched restaurants:', restaurants.length);
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error.message);
    res.status(500).json({ error: 'Failed to fetch restaurants. Please try again later.' });
  }
};
