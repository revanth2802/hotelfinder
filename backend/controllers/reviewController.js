const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');

exports.addReview = async (req, res) => {
  try {
    const { restaurantId, rating, comment } = req.body;

    const newReview = new Review({
      userId: req.user.id,
      restaurantId,
      rating,
      comment,
    });

    await newReview.save();

    // Update restaurant's average rating
    const reviews = await Review.find({ restaurantId });
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await Restaurant.findByIdAndUpdate(restaurantId, { ratings: avgRating });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
