const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // 1-5 fixed slots
  image: { type: String, required: true },
  title: { type: String, required: true },
  span: { type: String, required: true } // col-span/row-span configuration
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
