/**
 * Event Model - Festival events for Khalane Yatra Utsav
 * Supports categories: religious, cultural, sports, food, music, etc.
 */

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    enum: ['religious', 'cultural', 'sports', 'music', 'food', 'procession', 'competition', 'other'],
    default: 'other',
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  time: {
    type: String, // e.g. "10:00 AM"
    required: [true, 'Event time is required'],
  },
  endTime: { type: String }, // optional
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  image: { type: String, default: '' }, // path or URL
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  registrationRequired: { type: Boolean, default: false },
  maxParticipants: { type: Number, default: 0 }, // 0 = unlimited
  organizer: { type: String, default: 'Khalane Yatra Utsav Committee' },
  tags: [{ type: String }],
}, { timestamps: true });

// Index for faster searching
eventSchema.index({ title: 'text', description: 'text', category: 1 });

module.exports = mongoose.model('Event', eventSchema);
