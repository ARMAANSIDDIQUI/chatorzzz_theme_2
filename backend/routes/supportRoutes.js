const express = require('express');
const router = express.Router();
const { sendMessage, getMyTicket, getAllTickets, markAsRead } = require('../controllers/supportController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/message', protect, sendMessage);
router.get('/my', protect, getMyTicket);
router.get('/all', protect, restrictTo('admin'), getAllTickets);
router.put('/read/:ticketId', protect, restrictTo('admin'), markAsRead);

module.exports = router;
