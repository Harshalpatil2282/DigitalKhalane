/**
 * JWT Authentication Middleware
 * Protects admin routes
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.warn('⚠️ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not defined');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
    }

    // Verify token
    console.log('🔐 Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified for user:', decoded.id);

    // Get user from DB
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.warn('⚠️ User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (!user.isActive) {
      console.warn('⚠️ User is inactive:', user.email);
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth Middleware Error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

// Only superadmin can access
const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.',
      });
    }

    if (req.user.role !== 'superadmin') {
      console.warn(`⚠️ Non-superadmin access attempt: ${req.user.email}`);
      return res.status(403).json({
        success: false,
        message: 'Access restricted to superadmin.',
      });
    }
    
    next();
  } catch (error) {
    console.error('❌ AdminOnly Middleware Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = { protect, adminOnly };
