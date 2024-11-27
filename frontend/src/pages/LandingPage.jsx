import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';

const LandingPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);

  // Fetch restaurants
  const fetchGooglePlacesData = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/places/fetch', {
        location: '37.7749,-122.4194', // Example: San Francisco coordinates
        radius: 5000,
      });
      setRestaurants(response.data.slice(0, 8)); // Ensure slice is only called on a valid array
    } catch (error) {
      console.error('Error fetching Google Places data:', error.message);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch real-time reviews
  const fetchRealTimeReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reviews');
      setReviews(response.data.slice(0, 12)); // Ensure slice is only called on a valid array
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchGooglePlacesData();
    fetchRealTimeReviews();
  }, []);

  // Automatic Scrolling Logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({
          left: 1, // Adjust the speed of the scroll here
          behavior: 'smooth',
        });
      }
    }, 20); // Set interval for smooth scrolling

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section mb-5">
        <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {['food1.jpg', 'food2.jpg', 'food3.jpg', 'food4.jpg'].map((image, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <img
                  src={`/${image}`}
                  className="d-block w-100"
                  alt={`Slide ${index}`}
                  style={{ height: '500px', objectFit: 'cover' }}
                />
                <div className="carousel-caption d-none d-md-block">
                  <h1 className="display-4">Welcome to Restaurant Finder</h1>
                  <p className="lead">Discover the best dining experiences near you!</p>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* Popular Restaurants Section */}
      {/* Popular Restaurants Section */}
<section className="restaurant-section py-5">
  <h2 className="text-center mb-4">Popular Restaurants</h2>
  {loading && <div className="text-center my-4">Loading...</div>}
  <div
    className="container-fluid"
    ref={scrollContainerRef}
    style={{
      display: 'flex',
      overflowX: 'hidden', // Hide the scroll bar
      whiteSpace: 'nowrap',
      scrollBehavior: 'smooth',
      position: 'relative', // Ensure proper positioning for the content
    }}
  >
    {restaurants.map((restaurant) => (
      <div
        key={restaurant.id || restaurant.name}
        className="me-3"
        style={{ minWidth: '250px', display: 'inline-block' }}
      >
        <RestaurantCard restaurant={restaurant} />
      </div>
    ))}
  </div>
</section>


      {/* Real-Time Reviews Section */}
      <section className="reviews-section py-5">
        <h2 className="text-center mb-4">Real-Time Reviews</h2>
        <div className="container">
          <div className="row">
            {reviews.map((review, index) => (
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{review.user || 'Anonymous'}</h5>
                    <p className="card-text">{review.comment || 'No comment provided.'}</p>
                    <div className="d-flex align-items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i
                          key={i}
                          className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}
                          style={{ color: '#ffc107', marginRight: '4px' }}
                        ></i>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer py-4 bg-dark text-light text-center">
        <div className="container">
          <p>© 2024 Restaurant Finder. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
