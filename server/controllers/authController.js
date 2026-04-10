/**
 * Auth Controller - Admin login & profile
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc   Admin Login
// @route  POST /api/auth/login
// @access Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(`🔐 Login attempt: ${email}`);

    // Validate input
    if (!email || !password) {
      console.warn(`⚠️ Missing credentials - Email: ${!!email}, Password: ${!!password}`);
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.warn(`⚠️ Invalid email format: ${email}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Find user and include password field
    console.log('📝 Checking database for user...');
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.warn(`⚠️ User not found: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    console.log('🔑 Verifying password...');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.warn(`⚠️ Password mismatch for: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.warn(`⚠️ Inactive user attempted login: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    console.log(`✅ Generating token for: ${email}`);
    const token = generateToken(user._id);

    console.log(`✅ Login successful: ${email}`);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    console.error('Stack:', error.stack);
    next(error);
  }
};

// @desc   Get current admin profile
// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error('❌ GetMe Error:', error.message);
    next(error);
  }
};

module.exports = { login, getMe };
