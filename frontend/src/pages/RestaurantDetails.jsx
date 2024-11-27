import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const RestaurantDetails = () => {
  const { state } = useLocation(); // State passed from RestaurantCard
  const { id: placeId } = useParams(); // Extract placeId from URL
  const [restaurant, setRestaurant] = useState(state?.restaurant || null); // Use passed data if available
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: '', rating: 0 });
  const [loading, setLoading] = useState(!state?.restaurant);

  // Fetch Restaurant Details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const restaurantResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,formatted_address,photos,user_ratings_total,opening_hours,website&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
        );      

        if (restaurantResponse.data.status === 'OK') {
          setRestaurant(restaurantResponse.data.result);
        } else {
          console.error('Google API Error:', restaurantResponse.data.error_message);
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!restaurant) {
      fetchDetails();
    } else {
      setLoading(false);
    }
  }, [placeId, restaurant]);

  // Fetch Reviews from Backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsResponse = await axios.get(`http://localhost:5000/api/reviews/${placeId}`);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching reviews:', error.message);
      }
    };

    fetchReviews();
  }, [placeId]);

  // Handle Add Review
  const handleAddReview = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/reviews/${placeId}`, newReview);
      alert(response.data.message);
      setReviews([...reviews, response.data.savedReview]);
      setNewReview({ comment: '', rating: 0 });
    } catch (error) {
      console.error('Error adding review:', error.message);
      alert('Failed to post review. Please try again.');
    }
  };

  // Loading State
  if (loading) return <div className="text-center my-5">Loading...</div>;

  // Main UI
  return (
    <div className="container my-5">
      {restaurant && (
        <div>
          {/* Restaurant Name */}
          <h1>{restaurant.name}</h1>

          {/* Restaurant Image */}
          <img
  src={
    restaurant.photos?.[0]?.photo_reference
  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=640&photoreference=${restaurant.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
  : 'https://via.placeholder.com/640x480'

  }
  alt={restaurant.name}
  className="img-fluid my-4"
/>


          {/* Address */}
          <p><strong>Address:</strong> {restaurant.formatted_address}</p>

          {/* Phone Number */}
          <p><strong>Phone:</strong> {restaurant.formatted_phone_number || 'N/A'}</p>

          {/* Website */}
          {restaurant.website && (
            <p>
              <strong>Website:</strong>{' '}
              <a href={restaurant.website} target="_blank" rel="noopener noreferrer">
                {restaurant.website}
              </a>
            </p>
          )}

          {/* Opening Hours */}
          {restaurant.opening_hours?.weekday_text && (
            <div>
              <strong>Opening Hours:</strong>
              <ul>
                {restaurant.opening_hours.weekday_text.map((day, index) => (
                  <li key={index}>{day}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Ratings */}
          <div className="d-flex align-items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <i
                key={index}
                className={`bi ${index < Math.round(restaurant.rating) ? 'bi-star-fill' : 'bi-star'}`}
                style={{ color: '#ffc107', marginRight: '4px' }}
              ></i>
            ))}
            <span className="ms-2">({restaurant.user_ratings_total || 0} reviews)</span>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <h3>Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="mb-3">
            <strong>{review.user || 'Anonymous'}</strong>
            <p>
              {Array.from({ length: 5 }).map((_, i) => (
                <i
                  key={i}
                  className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}
                  style={{ color: '#ffc107', marginRight: '4px' }}
                ></i>
              ))}
            </p>
            <p>{review.comment}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet. Be the first to add one!</p>
      )}

      {/* Add Review Section */}
      <div className="mt-4">
        <h4>Add a Review</h4>
        <textarea
          className="form-control mb-2"
          rows="3"
          placeholder="Write your review..."
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Rating (1-5)"
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value, 10) })}
        />
        <button className="btn btn-primary" onClick={handleAddReview}>
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default RestaurantDetails;
