import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarOutline } from '@fortawesome/free-solid-svg-icons';

const RestaurantDetails = () => {
    const backendUrl = process.env.REACT_APP_BACKEND;
    const { placeId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ comment: '', rating: 0 });

    useEffect(() => {
        if (!placeId) {
            console.error('No placeId provided in URL');
            return;
        }
    
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/restaurant/google-details/${placeId}`);
                setRestaurant(response.data);
            } catch (error) {
                console.error('Error fetching restaurant details:', error.message);
            }
        };
    
        fetchDetails();
    }, [placeId, backendUrl]); // Include backendUrl
    
    useEffect(() => {
        if (!placeId) {
            console.error('No placeId provided in URL');
            return;
        }
    
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/reviews/${placeId}`);
                setReviews(response.data || []);
            } catch (error) {
                console.error('Error fetching reviews:', error.message);
            }
        };
    
        fetchReviews();
    }, [placeId, backendUrl]); // Include backendUrl
    

    const handleAddReview = async () => {
        if (!newReview.comment || newReview.rating < 1 || newReview.rating > 5) {
            alert('Please provide a valid comment and rating.');
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/api/reviews/${placeId}`, newReview);
            const savedReview = response.data.savedReview;

            // Add the new review to the state
            setReviews((prev) => [...prev, savedReview]);
            setNewReview({ comment: '', rating: 0 });
            alert('Review added!');
        } catch (error) {
            console.error('Error adding review:', error.message);
            alert('Failed to add review. Please try again later.');
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return (
            <>
                {Array.from({ length: fullStars }).map((_, index) => (
                    <FontAwesomeIcon
                        key={`full-${index}`}
                        icon={faStar}
                        style={{ color: '#ffc107', marginRight: '4px' }}
                    />
                ))}
                {halfStar === 1 && (
                    <FontAwesomeIcon
                        key="half-star"
                        icon={faStarHalfAlt}
                        style={{ color: '#ffc107', marginRight: '4px' }}
                    />
                )}
                {Array.from({ length: emptyStars }).map((_, index) => (
                    <FontAwesomeIcon
                        key={`empty-${index}`}
                        icon={faStarOutline}
                        style={{ color: '#ddd', marginRight: '4px' }}
                    />
                ))}
            </>
        );
    };

    if (!restaurant) return <p>Loading...</p>;

    return (
        <div className="container my-5">
            <h1>{restaurant.name}</h1>
            <img
                src={restaurant.imageUrl || 'https://via.placeholder.com/640x480'}
                className="card-img-top"
                alt={restaurant.name}
                style={{ height: '500px', objectFit: 'cover' }}
            />
            <p>
                <strong>Address:</strong> {restaurant.address || 'N/A'}
            </p>
            <p>
                <strong>Phone:</strong> {restaurant.phone || 'N/A'}
            </p>
            {restaurant.website && (
                <p>
                    <strong>Website:</strong>{' '}
                    <a href={restaurant.website} target="_blank" rel="noopener noreferrer">
                        {restaurant.website}
                    </a>
                </p>
            )}
            <p>
                <strong>Rating:</strong>
            </p>
                <div className="d-flex align-items-center">
                    {renderStars(restaurant.rating || 0)}
                    <span className="ms-2">{restaurant.rating || 0} / 5</span>
                </div>
            

            <h2 className="mt-5">Reviews</h2>
            {reviews.length > 0 ? (
                reviews.map((review, index) => (
                    <div key={index} className="mb-3">
                        <strong>{review.author_name || 'Anonymous'}</strong>
                        <p>{review.text}</p>
                        <div className="d-flex align-items-center">
                            {renderStars(review.rating || 0)}
                            <span className="ms-2">{review.rating || 0} / 5</span>
                        </div>
                    </div>
                ))
            ) : (
                <p>No reviews available. Be the first to add one!</p>
            )}

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
