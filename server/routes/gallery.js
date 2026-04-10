const express = require('express');
const router = express.Router();
const { getGallery, getAllGallery, addGalleryItem, deleteGalleryItem, updateGalleryItem } = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/', getGallery);

// Admin
router.get('/all', protect, getAllGallery);
router.post('/', protect, upload.single('file'), addGalleryItem);
router.put('/:id', protect, updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;
