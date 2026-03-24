const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  sugarLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  image: { type: String, required: true }, // Cloudinary Image URL
  video: { type: String }, // Cloudinary Video URL
  isFeatured: { type: Boolean, default: false },
  stock: { type: Number, default: 100 },
  rating: { type: Number, default: 5 },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      isApproved: { type: Boolean, default: false },
      isAdminReview: { type: Boolean, default: false }
    }
  ],
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
