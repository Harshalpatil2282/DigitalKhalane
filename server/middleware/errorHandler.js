/**
 * Global Error Handler Middleware
 * CRITICAL: Must be placed AFTER all route and middleware definitions
 */

const errorHandler = (err, req, res, next) => {
  // Prevent default Express error behavior
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log all errors with stack traces
  console.error('═══════════════════════════════════════════════════════');
  console.error('❌ ERROR CAUGHT BY HANDLER');
  console.error('Status:', statusCode);
  console.error('Message:', message);
  console.error('Type:', err.name);
  console.error('Stack:', err.stack);
  console.error('═══════════════════════════════════════════════════════');

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(e => e.message).join(', ');
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  // JWT expiration error
  if (err.name === 'TokenExpiredError') {
    message = 'Token has expired';
    statusCode = 401;
  }

  // Cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    message = 'Invalid ID format';
    statusCode = 400;
  }

  // Ensure we don't send sensitive info in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDevelopment && { 
      error: {
        name: err.name,
        stack: err.stack,
        details: err.message,
      }
    }),
  });
};

module.exports = errorHandler;
