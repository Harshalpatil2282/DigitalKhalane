/**
 * Donation Model - Festival donation records
 */

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Donor name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  phone: { type: String, trim: true },
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: [1, 'Amount must be at least 1'],
  },
  message: { type: String, default: '' },
  paymentMethod: {
    type: String,
    enum: ['upi', 'bank_transfer', 'cash', 'other'],
    default: 'upi',
  },
  transactionId: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed',
  },
  village: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
