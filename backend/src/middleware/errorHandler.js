// backend/src/middleware/errorHandler.js

/**
 * A centralized error handler middleware for Express.
 * This should be the last middleware added to your app.
 *
 * @param {Error} err - The error object.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  // Determine the status code, default to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Include the stack trace only in development mode for security reasons
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = errorHandler;
