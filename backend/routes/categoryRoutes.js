const express = require('express');
const router = express.Router();
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCategories)
  .post(protect, restrictTo('admin'), createCategory);

router.route('/:id')
  .delete(protect, restrictTo('admin'), deleteCategory);

module.exports = router;
