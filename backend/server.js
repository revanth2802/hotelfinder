const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in the .env file');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in the .env file');
  process.exit(1);
}

if (!process.env.PORT) {
  console.warn('Warning: PORT is not defined in the .env file. Using default port 5000.');
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan('dev')); // Log HTTP requests

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('Database connection error:', err.message);
    process.exit(1); // Exit process if database connection fails
  });

// Define routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/business', require('./routes/businessRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/places', require('./routes/placesRoutes')); // Added Google Places API route

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message || 'Internal Server Error');
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Fallback route for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
