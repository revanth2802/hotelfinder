const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    hours: { type: String, required: true },
    description: { type: String },
    photos: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // BusinessOwner
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: { type: Number, min: 1, max: 5 },
            comment: { type: String },
        },
    ],
    categories: [{ type: String }], // Example: Vegan, Fast Food, etc.
    priceRange: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
});

module.exports = mongoose.model('Both', restaurantSchema);
