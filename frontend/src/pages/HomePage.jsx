import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';


const HomePage = () => {
  const backendUrl = process.env.REACT_APP_BACKEND;
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    city: '',
    zipcode: '',
    minRating: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch restaurants from the API
  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      let response;
      const filtersApplied = Object.values(filters).some((value) => value);

      if (!filtersApplied) {
        // Default Feed: Fetch using /api/places/fetch
        console.log('Fetching default restaurants using /api/places/fetch');
        response = await axios.post(`${backendUrl}/api/places/fetch`, {
          location: '37.335480, -121.893028', // Default location (SF)
          radius: 5000, // Customize the radius if needed
        });
      } else {
        // Filtered Feed: Fetch using /api/searchfilter/search
        console.log('Fetching restaurants with filters:', filters);

        const updatedFilters = { ...filters };

        // Prioritize zipcode over city if both are present
        if (updatedFilters.zipcode) {
          delete updatedFilters.city;
        }

        response = await axios.post(`${backendUrl}/api/searchfilter/search`, {
          filters: Object.fromEntries(
            Object.entries(updatedFilters).filter(([_, value]) => value)
          ),
        });
      }

      // Handle response
      if (response?.data?.length > 0) {
        setRestaurants(response.data);
      } else {
        setErrorMessage('No restaurants found. Try adjusting your search filters.');
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error.message);
      setErrorMessage('Failed to fetch restaurants. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [backendUrl, filters]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const currentRestaurants = restaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Discover Restaurants</h1>

      {/* Search Filters */}
      <div className="row mb-4">
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Category"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="City"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Zipcode"
            value={filters.zipcode}
            onChange={(e) => setFilters({ ...filters, zipcode: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min Rating (1-5)"
            value={filters.minRating}
            onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
          />
        </div>
        <div className="col-md-2 mt-3">
          <button className="btn btn-primary w-100" onClick={fetchRestaurants}>
            Search
          </button>
        </div>
      </div>

      {/* Feedback Messages */}
      {loading && <div className="text-center my-4">Loading...</div>}
      {errorMessage && <div className="alert alert-danger my-4">{errorMessage}</div>}

      {/* Restaurant Cards */}
      <div className="row">
        {currentRestaurants.length > 0 ? (
          currentRestaurants.map((restaurant) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={restaurant.id}>
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))
        ) : (
          !loading && <div className="text-center my-5">No restaurants found.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index + 1}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default HomePage;
