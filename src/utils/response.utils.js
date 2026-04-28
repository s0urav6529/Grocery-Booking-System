/**
 * Reusable HTTP response helpers.
 *
 * These keep every controller's JSON envelope consistent and eliminate
 * copy-pasted `res.status(...).json({ success, message, data })` blocks.
 *
 * Usage:
 *   return sendSuccess(res, 200, 'Item retrieved successfully', item);
 *   return sendSuccess(res, 200, 'Items retrieved successfully', null, result);
 */

/**
 * Send a successful JSON response.
 *
 * @param {import('express').Response} res
 * @param {number} statusCode - HTTP status code (2xx)
 * @param {string} message    - Human-readable success message
 * @param {*}      [data]     - Single resource payload
 * @param {object} [spread]   - Object whose keys are spread into the response
 *                              (e.g. { data, pagination } from paginated queries)
 */
const sendSuccess = (res, statusCode, message, data = undefined, spread = undefined) => {
  const body = { success: true, message };

  if (spread !== undefined) {
    Object.assign(body, spread);
  } else if (data !== undefined) {
    body.data = data;
  }

  return res.status(statusCode).json(body);
};

/**
 * Send an error JSON response.
 *
 * @param {import('express').Response} res
 * @param {number} statusCode - HTTP status code (4xx / 5xx)
 * @param {string} message    - Human-readable error message
 * @param {string} [detail]   - Optional error.message for 500 responses
 */
const sendError = (res, statusCode, message, detail = undefined) => {
  const body = { success: false, message };
  if (detail !== undefined) body.error = detail;
  return res.status(statusCode).json(body);
};

/**
 * Creates a structured HTTP error object that can be thrown from any
 * service or middleware layer.
 *
 * The `asyncHandler` wrapper catches these and maps `error.status` directly
 * to the HTTP response status, so you never need to pass `res` into a service.
 *
 * Usage:
 *   throw createError(409, 'Contact already registered');
 *   throw createError(404, 'Item not found');
 *   throw createError(401, 'Invalid contact or password');
 *
 * @param {number} status  - HTTP status code
 * @param {string} message - Human-readable error message
 * @returns {Error} An Error instance with a `status` property attached
 */
const sendThrowError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = { sendSuccess, sendError, sendThrowError };
