/**
 * Security Middleware
 * Helmet for security headers, rate limiting for API protection
 */

const rateLimit = require('express-rate-limit');

// Rate limiter for login endpoint (strict)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 min
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter (lenient)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: { success: false, message: 'Too many requests. Please slow down.' },
  skip: (req) => process.env.NODE_ENV === 'development', // Skip in development
});

module.exports = { loginLimiter, apiLimiter };
