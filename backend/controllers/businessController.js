const Restaurant = require('../models/Restaurant');

exports.addRestaurant = async (req, res) => {
  try {
    const { name, address, contactInfo, hours, description, photos, categories, cuisine, priceRange } = req.body;

    const newRestaurant = new Restaurant({
      name,
      address,
      contactInfo,
      hours,
      description,
      photos,
      categories,
      cuisine,
      priceRange,
      ownerId: req.user.id,
    });

    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: id, ownerId: req.user.id },
      updatedData,
      { new: true }
    );

    if (!updatedRestaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.viewListings = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ ownerId: req.user.id });
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
