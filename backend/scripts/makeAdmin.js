require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path if your User model is elsewhere

const emailToPromote = process.argv[2];

if (!emailToPromote) {
  console.log('❌ Please provide the email address you want to promote.');
  console.log('Usage: node makeAdmin.js your_email@gmail.com');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB...');

    const user = await User.findOne({ email: emailToPromote });

    if (!user) {
      console.log(`❌ No user found with email: ${emailToPromote}`);
      console.log('Please sign up or log in first so your account exists in the database!');
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`ℹ️ User ${user.email} is already an Admin!`);
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log(`🎉 SUCCESS! The user ${user.name} (${user.email}) has been granted Admin powers!`);
    console.log('You can now log in and access the Master Admin Panel.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
