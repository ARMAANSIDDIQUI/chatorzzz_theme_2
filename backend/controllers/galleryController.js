const Gallery = require('../models/Gallery');
const cloudinary = require('cloudinary').v2;

// Get all gallery items
exports.getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create gallery item
exports.createGalleryItem = async (req, res) => {
  try {
    const { type, image, video, title, order } = req.body;
    const newItem = new Gallery({ type, image, video, title, order });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('❌ Gallery Creation Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// Update gallery item
exports.updateGalleryItem = async (req, res) => {
  try {
    const { type, image, video, title, order } = req.body;
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { type, image, video, title, order },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete gallery item
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Gallery item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
