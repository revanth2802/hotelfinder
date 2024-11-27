import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    priceRange: '',
    minRating: '',
  });
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch user's location
  const fetchUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationEnabled(true);
        },
        (error) => {
          console.error('Error fetching location:', error.message);
          setLocationEnabled(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // Fetch restaurants
  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      let response;

      // Prioritize location-based fetching if enabled and valid
      if (locationEnabled && location.lat && location.lng) {
        response = await axios.post('http://localhost:5000/api/places/fetch', {
          location: `${location.lat},${location.lng}`,
          radius: 5000,
          filters, // Include filters in the request payload
        });
      } else if (Object.values(filters).some((value) => value)) {
        // Fetch restaurants based on filters
        response = await axios.post('http://localhost:5000/api/places/search', { filters });
      } else {
        // Fetch random restaurants as a fallback
        response = await axios.get('http://localhost:5000/api/places/random');
      }

      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error.message);
    } finally {
      setLoading(false);
    }
  }, [filters, location, locationEnabled]);

  // Initial effect to fetch location or random restaurants
  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  // Effect to fetch restaurants based on location, filters, or locationEnabled state
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Pagination logic
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const currentRestaurants = restaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Discover Restaurants</h1>

      {/* Search Filters */}
      <div className="row mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name"
            value={filters.name}
            onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Category"
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-control"
            value={filters.priceRange}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: e.target.value }))}
          >
            <option value="">Price Range</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min Rating"
            value={filters.minRating}
            onChange={(e) => setFilters((prev) => ({ ...prev, minRating: e.target.value }))}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={() => setCurrentPage(1)}>
            Search
          </button>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && <div className="text-center my-4">Loading...</div>}

      {/* Restaurant Cards */}
      <div className="row">
        {currentRestaurants.map((restaurant) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={restaurant.id}>
            <RestaurantCard restaurant={restaurant} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index + 1}
              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
            >
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
