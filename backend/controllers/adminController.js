const Restaurant = require('../models/Restaurant');

exports.checkDuplicates = async (req, res) => {
  try {
    const duplicates = await Restaurant.aggregate([
      { $group: { _id: { name: "$name", address: "$address" }, count: { $sum: 1 }, ids: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } }
    ]);

    res.status(200).json({ duplicates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const removedRestaurant = await Restaurant.findByIdAndDelete(id);
    if (!removedRestaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json({ message: "Restaurant removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
