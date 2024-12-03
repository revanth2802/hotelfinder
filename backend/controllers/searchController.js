const axios = require('axios');

// Search restaurants using Google Places API
exports.searchRestaurants = async (req, res) => {
  const { name, category, zipcode, minRating, city } = req.body.filters || {};
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  try {
    let apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants`;

    if (name) apiUrl += `+${encodeURIComponent(name)}`;
    if (category) apiUrl += `+${encodeURIComponent(category)}`;
    if (zipcode) apiUrl += `+in+${encodeURIComponent(zipcode)}`;
    else if (city) apiUrl += `+in+${encodeURIComponent(city)}`;
    apiUrl += `&key=${apiKey}`;

    console.log('Requesting API:', apiUrl);

    const response = await axios.get(apiUrl);

    if (!response.data.results || response.data.results.length === 0) {
      return res.status(404).json({ error: 'No restaurants found matching the criteria.' });
    }

    let restaurants = response.data.results;

    if (minRating) {
      restaurants = restaurants.filter((place) => place.rating >= minRating);
    }

    const formattedRestaurants = restaurants.map((place) => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address || '',
      categories: place.types || [],
      rating: place.rating || 0,
      reviewsCount: place.user_ratings_total || 0,
      imageUrl: place.photos
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=640&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
        : 'https://via.placeholder.com/640x480',
    }));

    console.log('Fetched restaurants:', formattedRestaurants.length);
    res.status(200).json(formattedRestaurants);
  } catch (error) {
    console.error('Error searching restaurants:', error.message);
    res.status(500).json({ error: 'Failed to search restaurants. Please try again later.' });
  }
};
