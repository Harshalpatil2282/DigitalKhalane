/**
 * Async Error Handler Wrapper
 * Wraps async route handlers to catch unhandled promise rejections
 * This is CRITICAL for preventing server crashes
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
