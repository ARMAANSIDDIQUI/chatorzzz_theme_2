const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const Product = require('./backend/models/productModel');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const products = [
      {
        name: 'Test Bubble (₹1)',
        price: 1,
        image: 'https://res.cloudinary.com/demo/image/upload/v1612455854/sample.jpg',
        category: 'Gummies',
        stock: 999,
        description: 'Perfect for quick ₹1 transaction tests.'
      },
      {
        name: 'Magic Gem (₹2)',
        price: 2,
        image: 'https://res.cloudinary.com/demo/image/upload/v1612455854/sample.jpg',
        category: 'Chocolates',
        stock: 999,
        description: 'Perfect for quick ₹2 transaction tests.'
      }
    ];

    await Product.insertMany(products);
    console.log('Dummy products seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
