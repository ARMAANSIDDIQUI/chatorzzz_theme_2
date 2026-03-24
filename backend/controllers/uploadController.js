const cloudinary = require('cloudinary').v2;

// Centralized media upload controller
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const resourceType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { 
          folder: 'chatorzzz_uploads',
          resource_type: resourceType,
          access_mode: 'public'
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary SDK Error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('❌ Upload Controller Error:', error);
    res.status(500).json({ 
      message: 'Server-side upload failed',
      error: error.message 
    });
  }
};
