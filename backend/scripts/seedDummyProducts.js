require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const seedProducts = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('FATAL: MONGODB_URI is not defined in .env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Database successfully.');

    // Upload the two requested dummy products
    const products = [
      {
        name: 'Cotton Candy Stick (Dummy 1)',
        category: 'Lollipops',
        description: 'A dummy product worth exactly 1 to test your checkout flow.',
        price: 1,
        stock: 999,
        image: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?q=80&w=400&auto=format&fit=crop',
        rating: 5,
        numReviews: 0
      },
      {
        name: 'Sour Neon Worms (Dummy 2)',
        category: 'Gummies',
        description: 'A dummy product worth exactly 2 to test your checkout flow.',
        price: 2,
        stock: 999,
        image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=400&auto=format&fit=crop',
        rating: 5,
        numReviews: 0
      }
    ];

    await Product.insertMany(products);
    console.log('Successfully inserted 2 dummy products for testing!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedProducts();
