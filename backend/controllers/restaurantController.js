const axios = require('axios');

exports.getRestaurantDetails = async (req, res) => {
  const { placeId } = req.params;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  // Validate the placeId
  if (!placeId) {
    return res.status(400).json({ error: 'Invalid or missing placeId' });
  }

  try {
    console.log(`Fetching details from Google Places API for placeId: ${placeId}`);

    // Fetch restaurant details from Google Places API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,photos,rating,reviews,formatted_address,formatted_phone_number,website&key=${apiKey}`
    );

    // Check the response status from Google API
    if (response.data.status !== 'OK') {
      console.error('Google Places API Error:', response.data.error_message || 'Unknown error');
      return res.status(404).json({ error: response.data.error_message || 'Place ID not found' });
    }

    const details = response.data.result;

    // Transform the response for the frontend
    const transformedDetails = {
      name: details.name || 'N/A',
      address: details.formatted_address || 'N/A',
      phone: details.formatted_phone_number || 'N/A',
      website: details.website || null,
      rating: details.rating || 0,
      reviews: details.reviews || [],
      imageUrl: details.photos?.[0]?.photo_reference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=640&photoreference=${details.photos[0].photo_reference}&key=${apiKey}`
        : 'https://via.placeholder.com/640x480', // Default placeholder image
    };

    console.log('Restaurant details transformed and sent:', transformedDetails.name);

    // Send transformed data to the frontend
    res.status(200).json(transformedDetails);
  } catch (error) {
    console.error('Error fetching restaurant details:', error.message);

    // Handle specific errors from Axios or Google API
    if (error.response && error.response.status === 403) {
      res.status(403).json({ error: 'Access forbidden. Check your Google API key permissions.' });
    } else {
      res.status(500).json({ error: 'Failed to fetch restaurant details. Please try again later.' });
    }
  }
};
