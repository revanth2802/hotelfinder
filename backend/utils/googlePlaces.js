const axios = require('axios');
const Restaurant = require('../models/Restaurant'); // Your MongoDB model

const fetchGooglePlacesData = async (location, radius = 5000, type = 'restaurant') => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;
    const response = await axios.get(url);
    const places = response.data.results;

    const restaurantData = places.map((place) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity || '',
      city: '', // You can use Geocoding API for city/state if needed
      state: '',
      zip: '',
      categories: place.types.includes('restaurant') ? ['Restaurant'] : place.types,
      priceRange: place.price_level ? ['Low', 'Medium', 'High'][place.price_level - 1] : 'Medium',
      ratings: place.rating || 0,
      reviewCount: place.user_ratings_total || 0,
      imageUrl: place.photos
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=640&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
        : 'https://via.placeholder.com/640x480',
    }));

    await Restaurant.insertMany(restaurantData);
    console.log('Google Places data saved to MongoDB');
  } catch (error) {
    console.error('Error fetching data from Google Places API:', error.message);
    throw new Error(error.message);
  }
};

module.exports = { fetchGooglePlacesData };
