/**
 * Centralized error handling middleware.
 * Any error thrown (or passed to next()) in controllers ends up here.
 */
const logger = require('../config/logger');
const env = require('../config/env');

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

function notFoundHandler(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Prisma known errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = `Duplicate value for field: ${err.meta?.target?.join(', ') || 'unknown'}`;
  }
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  logger.error(message, {
    statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: env.isDevelopment ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.isDevelopment && { stack: err.stack }),
  });
}

module.exports = { AppError, notFoundHandler, errorHandler };
