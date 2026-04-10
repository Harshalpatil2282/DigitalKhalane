/**
 * Gallery Controller
 */

const Gallery = require('../models/Gallery');
const path = require('path');
const fs = require('fs');

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
    const data = {
      ...req.body,
      url: `/uploads/${req.file.filename}`,
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
    const filePath = path.join(__dirname, '../', item.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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
