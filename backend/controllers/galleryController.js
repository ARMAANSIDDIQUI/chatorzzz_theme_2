const Gallery = require('../models/Gallery');

// Get all gallery items
exports.getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ id: 1 });
    
    // If empty, initialize with default slots
    if (items.length === 0) {
      const defaults = [
        { id: 1, image: '/assets/images/candy1.png', title: 'Crystal Pops', span: 'col-span-2 row-span-2' },
        { id: 2, image: '/assets/images/candy2.png', title: 'Crystal Pops', span: 'col-span-1 row-span-1' },
        { id: 3, image: '/assets/images/candy3.png', title: 'Gummy Galaxies', span: 'col-span-1 row-span-2' },
        { id: 4, image: '/assets/images/candy4.png', title: 'Gummy Galaxies', span: 'col-span-1 row-span-1' },
        { id: 5, image: '/assets/images/candy1.png', title: 'Rainbow Rocks', span: 'col-span-2 row-span-1' },
        { id: 6, image: '/assets/images/candy2.png', title: 'Rainbow Rocks', span: 'col-span-1 row-span-1' },
        { id: 7, image: '/assets/images/candy3.png', title: 'Sweet Stars', span: 'col-span-1 row-span-1' },
        { id: 8, image: '/assets/images/candy4.png', title: 'Sweet Stars', span: 'col-span-1 row-span-1' },
        { id: 9, image: '/assets/images/candy1.png', title: 'Magic Clouds', span: 'col-span-2 row-span-1' },
      ];
      const created = await Gallery.insertMany(defaults);
      return res.json(created);
    }
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update gallery item
exports.updateGalleryItem = async (req, res) => {
  try {
    const { id, image, title } = req.body;
    const item = await Gallery.findOneAndUpdate(
      { id },
      { image, title },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Slot not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
