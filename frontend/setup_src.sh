#!/bin/bash

# Create directory structure
mkdir -p src/components src/pages src/utils src/redux/slices

# Create index.js
cat <<EOL > src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
EOL

# Create App.js
cat <<EOL > src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import BusinessDashboard from './pages/BusinessDashboard';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/business-dashboard" element={<BusinessDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
EOL

# Create basic pages
cat <<EOL > src/pages/HomePage.jsx
import React from 'react';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to RestaurantFinder</h1>
      <p>Search for restaurants and manage your business listings easily.</p>
    </div>
  );
};

export default HomePage;
EOL

cat <<EOL > src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({});

  const handleSearch = async () => {
    const response = await axios.get('/api/restaurants', { params: filters });
    setRestaurants(response.data);
  };

  useEffect(() => {
    handleSearch();
  }, [filters]);

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
EOL

cat <<EOL > src/pages/BusinessDashboard.jsx
import React from 'react';

const BusinessDashboard = () => {
  return (
    <div>
      <h1>Business Dashboard</h1>
      <p>Manage your restaurant listings here.</p>
    </div>
  );
};

export default BusinessDashboard;
EOL

cat <<EOL > src/pages/AdminDashboard.jsx
import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Review and manage duplicate restaurant entries here.</p>
    </div>
  );
};

export default AdminDashboard;
EOL

# Create utils/api.js
cat <<EOL > src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

export default API;
EOL

# Create redux store and slices
cat <<EOL > src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
EOL

cat <<EOL > src/redux/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
EOL

# Create CSS files
cat <<EOL > src/index.css
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

h1 {
  color: #333;
}
EOL

cat <<EOL > src/App.css
.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
}
EOL

echo "React src folder structure and files have been set up!"
