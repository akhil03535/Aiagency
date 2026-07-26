/**
 * Standardized API response shapes so every endpoint returns
 * consistent JSON: { success, message, data } or { success, message, errors }.
 */

function success(res, { statusCode = 200, message = 'Success', data = null, meta = null }) {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  if (meta !== null) body.meta = meta;
  return res.status(statusCode).json(body);
}

function created(res, opts = {}) {
  return success(res, { statusCode: 201, message: 'Created', ...opts });
}

module.exports = { success, created };
