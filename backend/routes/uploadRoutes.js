const express = require('express');
const router = express.Router();
const { uploadMedia } = require('../controllers/uploadController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Unified upload route for all media (Admin only)
router.post('/', protect, restrictTo('admin'), upload.single('file'), uploadMedia);

module.exports = router;
