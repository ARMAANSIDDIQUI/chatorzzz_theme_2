const express = require('express');
const router = express.Router();
const { getGallery, updateGalleryItem } = require('../controllers/galleryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getGallery);

router.post('/', protect, restrictTo('admin'), require('../controllers/galleryController').createGalleryItem);
router.put('/:id', protect, restrictTo('admin'), updateGalleryItem);
router.delete('/:id', protect, restrictTo('admin'), require('../controllers/galleryController').deleteGalleryItem);

module.exports = router;
