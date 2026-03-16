const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    // Check if user is a certified buyer
    const orders = await Order.find({ 
      user: req.user._id,
      status: 'Delivered',
      'orderItems.product': req.params.id 
    });

    if (orders.length === 0) {
      return res.status(403).json({ message: 'Only certified buyers can review this product' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      isApproved: false, // Needs admin moderation
      isAdminReview: false
    };

    product.reviews.push(review);
    await product.save();

    res.status(201).json({ message: 'Review added successfully and is pending approval' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all pending reviews (Admin)
// @route   GET /api/products/reviews/pending
// @access  Private/Admin
exports.getPendingReviews = async (req, res) => {
  try {
    const products = await Product.find({ 'reviews.isApproved': false });
    
    let pendingReviews = [];
    products.forEach(product => {
      product.reviews.forEach(review => {
        if (!review.isApproved) {
          pendingReviews.push({
            productId: product._id,
            productName: product.name,
            review
          });
        }
      });
    });

    res.json(pendingReviews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Approve a review (Admin)
// @route   PUT /api/products/:productId/reviews/:reviewId/approve
// @access  Private/Admin
exports.approveReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.isApproved = true;

    // Update product rating and numReviews
    product.numReviews = product.reviews.filter(r => r.isApproved).length;
    product.rating = product.reviews
      .filter(r => r.isApproved)
      .reduce((acc, item) => item.rating + acc, 0) / product.numReviews;

    await product.save();
    res.json({ message: 'Review approved successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a review (Admin or User)
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Only admin or the user who wrote the review can delete it
    if (req.user.role !== 'admin' && review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this review' });
    }

    review.remove();
    
    // Update product rating and numReviews
    product.numReviews = product.reviews.filter(r => r.isApproved).length;
    if (product.numReviews > 0) {
      product.rating = product.reviews
        .filter(r => r.isApproved)
        .reduce((acc, item) => item.rating + acc, 0) / product.numReviews;
    } else {
      product.rating = 5; // Default rating
    }

    await product.save();
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Admin create direct review
// @route   POST /api/products/:id/admin-review
// @access  Private/Admin
exports.adminCreateReview = async (req, res) => {
  try {
    const { rating, comment, userName } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      name: userName || 'Admin Verified',
      rating: Number(rating),
      comment,
      user: req.user._id,
      isApproved: true, // Auto-approved
      isAdminReview: true
    };

    product.reviews.push(review);
    
    // Update product rating and numReviews
    product.numReviews = product.reviews.filter(r => r.isApproved).length;
    product.rating = product.reviews
      .filter(r => r.isApproved)
      .reduce((acc, item) => item.rating + acc, 0) / product.numReviews;

    await product.save();
    res.json({ message: 'Admin review added successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
