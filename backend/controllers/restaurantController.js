const Restaurant = require('../models/Restaurant');

exports.getRestaurants = async (req, res) => {
  try {
    const { name, categories, cuisine, priceRange } = req.query;
    const filters = {};

    if (name) filters.name = { $regex: name, $options: 'i' };
    if (categories) filters.categories = { $in: categories.split(',') };
    if (cuisine) filters.cuisine = { $regex: cuisine, $options: 'i' };
    if (priceRange) filters.priceRange = priceRange;

    const restaurants = await Restaurant.find(filters);
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id).populate('ownerId', 'name email');

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
