import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const SearchPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({});

  const handleSearch = useCallback(async () => {
    try {
      const response = await axios.get('/api/restaurants', { params: filters });
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  }, [filters]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div>
      <h1>Search Restaurants</h1>
      <input
        type="text"
        placeholder="Search by name"
        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {restaurants.map((restaurant) => (
          <div key={restaurant._id}>
            <h3>{restaurant.name}</h3>
            <p>{restaurant.address}</p>
            <p>Ratings: {restaurant.ratings} stars</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
