const { response } = require('./response.utils');

/**
 * Wraps an async Express route handler and centralises error handling.
 *
 * Service layers signal business errors by throwing plain objects with a
 * `status` (HTTP status code) and `message` property.  All other thrown
 * values are treated as unexpected internal errors (500).
 *
 * Usage:
 *   static getItem = asyncHandler(async (req, res) => { ... });
 *
 * @param {Function} fn - Async (req, res, next) handler
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    if (error.status) {
      return response.sendError(res, error.status, error.message);
    }

    console.error('Unhandled error:', error);
    return response.sendError(res, 500, 'Internal server error', error.message);
  }
};

module.exports = { asyncHandler };

