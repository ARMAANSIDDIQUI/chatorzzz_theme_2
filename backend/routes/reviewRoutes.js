const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Specific pending reviews route (must be above /:id)
router.get('/pending', protect, restrictTo('admin'), reviewController.getPendingReviews);

// Submission & Admin Direct Review
router.post('/:id', protect, reviewController.createProductReview);
router.post('/:id/admin', protect, restrictTo('admin'), reviewController.adminCreateReview);

// Moderation
router.put('/:productId/:reviewId/approve', protect, restrictTo('admin'), reviewController.approveReview);
router.delete('/:productId/:reviewId', protect, reviewController.deleteReview);

module.exports = router;
