const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, orderController.addOrderItems);
router.get('/myorders', protect, orderController.getMyOrders);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/pay', protect, orderController.updateOrderToPaid);

// Admin routes
router.get('/', protect, restrictTo('admin'), orderController.getOrders);
router.put('/:id/status', protect, restrictTo('admin'), orderController.updateOrderStatus);

module.exports = router;
