/**
 * Gallery Controller
 * Updated for Cloudinary storage
 */

const Gallery = require('../models/Gallery');
const { deleteFromCloudinary, getPublicIdFromUrl } = require('../middleware/upload');

const getGallery = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type && type !== 'all') filter.type = type;
    const items = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) { next(error); }
};

const getAllGallery = async (req, res, next) => {
  try {
    const items = await Gallery.find({}).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) { next(error); }
};

const addGalleryItem = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'File is required' });
    
    // Cloudinary returns file info in req.file
    // req.file.path contains the Cloudinary URL
    // req.file.filename contains the public_id
    const data = {
      ...req.body,
      url: req.file.path, // Cloudinary secure URL
      publicId: req.file.filename, // Cloudinary public_id
      type: req.file.mimetype.startsWith('video') ? 'video' : 'photo',
    };
    const item = await Gallery.create(data);
    res.status(201).json({ success: true, message: 'Gallery item added', item });
  } catch (error) { next(error); }
};

const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    
    // Delete from Cloudinary if publicId exists
    if (item.publicId) {
      const resourceType = item.type === 'video' ? 'video' : 'image';
      await deleteFromCloudinary(item.publicId, resourceType);
    } else if (item.url) {
      // Fallback: try to extract public ID from URL
      const publicId = getPublicIdFromUrl(item.url);
      if (publicId) {
        const resourceType = item.type === 'video' ? 'video' : 'image';
        await deleteFromCloudinary(publicId, resourceType);
      }
    }
    
    await item.deleteOne();
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) { next(error); }
};

const updateGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, item });
  } catch (error) { next(error); }
};

module.exports = { getGallery, getAllGallery, addGalleryItem, deleteGalleryItem, updateGalleryItem };