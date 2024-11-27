const fs = require('fs');
const { faker } = require('@faker-js/faker');

// Predefined list of Bay Area cities
const bayAreaCities = [
  'San Francisco',
  'San Jose',
  'Fremont',
  'Milpitas',
  'Sunnyvale',
  'Palo Alto',
  'Mountain View',
  'Berkeley',
  'Oakland',
  'Santa Clara',
];

// Generate restaurants with mostly Bay Area addresses
const generateRestaurants = (count) => {
  const restaurants = [];
  for (let i = 0; i < count; i++) {
    restaurants.push({
      id: faker.string.uuid(), // UUID
      name: faker.company.name(), // Company name
      address: faker.location.streetAddress(), // Street address
      city: faker.helpers.arrayElement(bayAreaCities), // Random Bay Area city
      state: 'California', // State fixed to California
      zip: faker.location.zipCode('#####'), // 5-digit ZIP code
      categories: faker.helpers.arrayElement([
        'Italian',
        'Chinese',
        'Mexican',
        'Indian',
        'Vegan',
        'American',
        'Japanese',
        'Thai',
        'Mediterranean',
      ]), // Random category
      priceRange: faker.helpers.arrayElement(['Low', 'Medium', 'High']), // Price range
      ratings: faker.number.float({ min: 1, max: 5, precision: 0.1 }), // Ratings
      reviewCount: faker.number.int({ min: 1, max: 500 }), // Review count
      imageUrl: `https://loremflickr.com/640/480/food?random=${faker.number.int()}`, // Food-related placeholder image
    });
  }
  return restaurants;
};

// Generate reviews for restaurants
const generateReviews = (restaurantId, count) => {
  const reviews = [];
  for (let i = 0; i < count; i++) {
    reviews.push({
      id: faker.string.uuid(), // UUID for the review
      restaurantId: restaurantId, // Link to restaurant
      user: faker.person.fullName(), // Full name
      comment: faker.lorem.sentence(), // Review text
      rating: faker.number.int({ min: 1, max: 5 }), // Rating
      date: faker.date.past(), // Date of review
    });
  }
  return reviews;
};

// Create the mock dataset
const createMockData = () => {
  const restaurantCount = 1500; // Number of restaurants
  const restaurants = generateRestaurants(restaurantCount);
  const reviews = restaurants.flatMap((restaurant) =>
    generateReviews(restaurant.id, faker.number.int({ min: 5, max: 20 }))
  );

  // Write data to JSON files
  fs.writeFileSync('restaurants.json', JSON.stringify(restaurants, null, 2));
  fs.writeFileSync('reviews.json', JSON.stringify(reviews, null, 2));
  console.log('Mock data generated: restaurants.json and reviews.json');
};

createMockData();
