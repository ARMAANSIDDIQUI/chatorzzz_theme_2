const express = require('express');
const router = express.Router();
const { createInquiry, getAllInquiries, deleteInquiry } = require('../controllers/contactController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', createInquiry);
router.get('/', protect, restrictTo('admin'), getAllInquiries);
router.delete('/:id', protect, restrictTo('admin'), deleteInquiry);

module.exports = router;
