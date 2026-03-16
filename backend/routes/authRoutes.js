const express = require('express');
const authController = require('../controllers/authController');
const User = require('../models/User');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Admin routes
router.get('/users', protect, restrictTo('admin'), async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ status: 'success', data: { users } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
