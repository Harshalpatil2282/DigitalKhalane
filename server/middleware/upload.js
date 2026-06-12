/**
 * Cloudinary Upload Middleware
 * Handles image & video file uploads to Cloudinary
 * Replaces local disk storage for serverless deployment
 */

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Determine folder based on route
    let folder = 'digitalkhalane/uploads';
    if (req.path.includes('/gallery')) folder = 'digitalkhalane/gallery';
    else if (req.path.includes('/events')) folder = 'digitalkhalane/events';
    else if (req.path.includes('/content')) folder = 'digitalkhalane/content';

    // Determine resource type
    const isVideo = file.mimetype.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    return {
      folder,
      resource_type: resourceType,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'mkv'],
      transformation: isVideo ? [] : [{ quality: 'auto', fetch_format: 'auto' }],
      // Generate unique public ID
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
  },
});

// File filter — allow images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv/;
  const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpg, png, gif, webp) and videos (mp4, mov, avi) are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

// Helper to delete file from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

// Helper to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const folderPath = parts.slice(parts.indexOf('digitalkhalane')).join('/');
  return folderPath.replace(/\.[^/.]+$/, ''); // Remove extension
};

module.exports = { upload, deleteFromCloudinary, getPublicIdFromUrl, cloudinary };