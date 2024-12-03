const Both = require('../models/Both');

// Add a new restaurant
exports.addRestaurant = async (req, res) => {
    try {
        const { name, address, contact, hours, description, categories, priceRange } = req.body;
        const photos = req.files ? req.files.map(file => file.path) : []; // Handle uploaded photos

        const newRestaurant = new Both({
            name,
            address,
            contact,
            hours,
            description,
            photos,
            categories: categories ? categories.split(',').map(cat => cat.trim()) : [], // Convert categories to array
            priceRange,
            owner: req.user.id, // Associate with the logged-in owner
        });

        const savedRestaurant = await newRestaurant.save();
        res.status(201).json(savedRestaurant);
    } catch (error) {
        console.error('Error adding restaurant:', error.message);
        res.status(500).json({ message: 'Failed to add restaurant.' });
    }
};

// Get restaurants owned by the logged-in BusinessOwner
exports.getMyRestaurants = async (req, res) => {
    try {
        const ownerId = req.user.id; // Assuming `req.user.id` contains the authenticated user's ID
        const restaurants = await Both.find({ owner: ownerId });
        if (restaurants.length === 0) {
            return res.status(404).json({ message: 'No restaurants found for this owner.' });
        }
        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error.message);
        res.status(500).json({ message: 'Failed to fetch restaurants.' });
    }
};

// Update a restaurant owned by the logged-in BusinessOwner
exports.updateRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const { name, address, contact, hours, description, categories, priceRange } = req.body;
        console.log('Update request body:', req.body); // Debugging request data
        const photos = req.files ? req.files.map(file => file.path) : []; // Handle uploaded photos

        const restaurant = await Both.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }
        if (restaurant.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this restaurant.' });
        }

        // Update fields
        restaurant.name = name || restaurant.name;
        restaurant.address = address || restaurant.address;
        restaurant.contact = contact || restaurant.contact;
        restaurant.hours = hours || restaurant.hours;
        restaurant.description = description || restaurant.description;
        restaurant.categories = categories ? categories.split(',').map(cat => cat.trim()) : restaurant.categories;
        restaurant.priceRange = priceRange || restaurant.priceRange;
        if (photos.length > 0) {
            restaurant.photos = photos;
        }

        const updatedRestaurant = await restaurant.save();
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        console.error('Error updating restaurant:', error.message);
        res.status(500).json({ message: 'Failed to update restaurant.' });
    }
};


// Get restaurants by owner ID (for Admins)
exports.getRestaurantsByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;

        if (!ownerId) {
            return res.status(400).json({ message: 'Owner ID is required.' });
        }

        const restaurants = await Both.find({ owner: ownerId });
        if (restaurants.length === 0) {
            return res.status(404).json({ message: 'No restaurants found for this owner.' });
        }

        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants by owner:', error.message);
        res.status(500).json({ message: 'Failed to fetch restaurants.' });
    }
};


// Delete a restaurant (for Admins)
exports.deleteRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const restaurant = await Both.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        // Delete the restaurant
        await Both.deleteOne({ _id: restaurantId });

        res.status(200).json({ message: 'Restaurant deleted successfully.' });
    } catch (error) {
        console.error('Error deleting restaurant:', error.message);
        res.status(500).json({ message: 'Failed to delete restaurant.' });
    }
};


exports.closeRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const restaurant = await Both.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        // Ensure the owner is the one making the request
        if (req.user.role !== 'Admin' && restaurant.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: Unauthorized to close this restaurant.' });
        }

        // Update restaurant status
        restaurant.status = 'Closed';
        await restaurant.save();

        res.status(200).json({ message: 'Restaurant closed successfully.' });
    } catch (error) {
        console.error('Error closing restaurant:', error.message);
        res.status(500).json({ message: 'Failed to close restaurant.' });
    }
};

