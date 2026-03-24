const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  image: { type: String },
  video: { type: String },
  title: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
