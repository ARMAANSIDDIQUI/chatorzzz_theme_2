const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const candies = [
  {
    name: "Nebula Swirl Lollipop",
    price: 4.99,
    description: "A cosmic blast of berry flavors in a stunning 3D swirl.",
    category: "Lollipops",
    sugarLevel: "Medium",
    image: "https://images.unsplash.com/photo-1575224300306-1b8da36134b4?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    stock: 50
  },
  {
    name: "Crystal Rock Candy",
    price: 3.50,
    description: "Pure sugar crystals grown to perfection with a hint of lavender.",
    category: "Hard Candy",
    sugarLevel: "High",
    image: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    stock: 100
  },
  {
    name: "Pastel Cloud Gummies",
    price: 5.95,
    description: "Soft, pillowy gummies that taste like floating on a marshmallow cloud.",
    category: "Gummies",
    sugarLevel: "Low",
    image: "https://images.unsplash.com/photo-1582050041567-9cda33e4b158?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    stock: 75
  },
  {
    name: "Electric Sour Strips",
    price: 2.99,
    description: "Zesty, zingy, and shockingly sour strips that will wake up your taste buds.",
    category: "Sours",
    sugarLevel: "Medium",
    image: "https://images.unsplash.com/photo-1533552763318-97300c406852?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    stock: 120
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');
    
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    await Product.insertMany(candies);
    console.log('🍭 Seeded initial candies');
    
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
