const express = require('express');
const router = express.Router();
const { getGallery, updateGalleryItem } = require('../controllers/galleryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/', getGallery);
router.put('/', protect, restrictTo('admin'), updateGalleryItem);

module.exports = router;
