/**
 * Gallery Model - Festival photos and videos
 */

const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  caption: { type: String, default: '' },
  url: {
    type: String,
    required: [true, 'File URL is required'],
  },
  type: {
    type: String,
    enum: ['photo', 'video'],
    default: 'photo',
  },
  year: {
    type: Number,
    default: new Date().getFullYear(),
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null,
  },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
