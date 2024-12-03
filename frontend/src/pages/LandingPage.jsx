import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import RestaurantCard from '../components/RestaurantCard';

const LandingPage = () => {
  const backendUrl = process.env.REACT_APP_BACKEND;
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch restaurants
  const fetchGooglePlacesData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/places/fetch`, {
        location: '37.7749,-122.4194', // Example: San Jose coordinates
        radius: 5000,
      });
      setRestaurants(response.data.slice(0, 8));
    } catch (error) {
      console.error('Error fetching Google Places data:', error.message);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchGooglePlacesData();
  }, [fetchGooglePlacesData]);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section mb-5">
        <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {['food2.jpg', 'food3.jpg', 'food4.jpg'].map((image, index) => (
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

      {/* About Section */}
      <section className="about-section text-center py-4">
        <div className="container">
          <p className="lead">
            "Welcome to <strong>Restaurant Finder</strong>, your ultimate destination for discovering the best
            dining experiences around. Whether you're in the mood for gourmet meals, casual dining, or hidden
            gems, we help you find the perfect spot. Start your culinary adventure with us!"
          </p>
          <button
            className="btn btn-light btn-lg d-inline-flex align-items-center mt-3"
            style={{
              backgroundColor: '#469361 ',
              border: 'none',
              color: '#fff',
              borderRadius: '25px',
              padding: '10px 20px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            onClick={() => navigate('/find')}
          >
            <FontAwesomeIcon icon={faUtensils} className="me-2" />
            Find Your Restaurant
          </button>
        </div>
      </section>

      {/* Popular Restaurants Section */}
      <section className="restaurant-section py-5">
        <h2 className="text-center mb-4">Popular Restaurants</h2>
        {loading && <div className="text-center my-4">Loading...</div>}
        <div className="container">
          <div className="row">
            {restaurants.map((restaurant, index) => (
              <div
                key={restaurant.id || restaurant.name}
                className="col-lg-3 col-md-4 col-sm-6 mb-4"
              >
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant Description Section 1 */}
      <section className="description-section py-5">
        <div className="container">
          <h2 className="text-center mb-4">Discover Culinary Excellence</h2>
          <p className="text-center lead">
            At Restaurant Finder, we bring you an extensive list of top-rated dining spots.
            Explore a wide variety of cuisines, from authentic local delicacies to global gourmet flavors.
            Every restaurant in our directory is carefully curated to offer you an unforgettable dining experience.
          </p>
        </div>
      </section>

      {/* Restaurant Description Section 2 */}
      <section className="description-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Your Dining Experience Simplified</h2>
          <p className="text-center lead">
            Looking for a place to celebrate, relax, or simply enjoy a meal? Restaurant Finder
            provides real-time information on menus, pricing, ambiance, and user reviews to help
            you make an informed decision. Let us guide you to your next favorite dining spot!
          </p>
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
