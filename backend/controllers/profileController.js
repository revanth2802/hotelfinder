const User = require('../models/User'); // Assuming a User model exists for interacting with the database

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated request
    const user = await User.findById(userId).select('-password'); // Exclude password field

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated request
    const updates = req.body; // Assume valid updates are provided in the request body

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password field in the response

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};
