const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: false },
  state: { type: String, required: false },
  zip: { type: String, required: false },
  categories: { type: [String], default: [] },
  priceRange: { type: String, default: 'Medium' },
  ratings: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  imageUrl: { type: String, required: false },
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
