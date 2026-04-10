/**
 * Announcement Model - Festival news & updates
 */

const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'urgent'],
    default: 'info',
  },
  isActive: { type: Boolean, default: true },
  isPinned: { type: Boolean, default: false },
  image: { type: String, default: '' },
  link: { type: String, default: '' }, // optional external link
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
