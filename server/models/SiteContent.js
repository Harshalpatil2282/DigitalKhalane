/**
 * SiteContent Model - CMS for homepage & festival settings
 * Single document (singleton) pattern for site-wide content
 */

const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  // Festival countdown
  festivalDate: {
    type: Date,
    default: new Date('2025-04-14T00:00:00+05:30'),
  },
  festivalYear: { type: Number, default: 2025 },

  // Hero Section
  heroTitle: {
    type: String,
    default: 'खलाने यात्रा उत्सव',
  },
  heroSubtitle: {
    type: String,
    default: 'A Grand Festival of Faith, Culture & Togetherness',
  },
  heroImage: { type: String, default: '' },

  // About / History section
  historyTitle: { type: String, default: 'History of Khalane Yatra' },
  historyContent: {
    type: String,
    default: 'Khalane Yatra Utsav is a centuries-old annual festival celebrated in the village of Khalane. It is a sacred pilgrimage and cultural celebration that brings together thousands of devotees and families from across the region. The festival honors the local deity, strengthens community bonds, and preserves the rich cultural heritage of the region.',
  },
  historyImage: { type: String, default: '' },

  // Highlights
  highlights: [{
    icon: { type: String, default: '🎪' },
    title: { type: String },
    description: { type: String },
  }],

  // Contact details
  contactEmail: { type: String, default: 'info@digitalkhalane.in' },
  contactPhone: { type: String, default: '+91 98765 43210' },
  contactAddress: { type: String, default: 'Khalane Village, Nashik District, Maharashtra' },

  // Social Links
  facebookUrl: { type: String, default: '' },
  instagramUrl: { type: String, default: '' },
  youtubeUrl: { type: String, default: '' },
  whatsappNumber: { type: String, default: '' },

  // Bank details for donation
  bankName: { type: String, default: 'State Bank of India' },
  accountNumber: { type: String, default: '0000 0000 0000' },
  ifscCode: { type: String, default: 'SBIN0000000' },
  upiId: { type: String, default: 'khalaneyatra@upi' },

  // Google Maps embed URL
  mapEmbedUrl: { type: String, default: '' },

}, { timestamps: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);
