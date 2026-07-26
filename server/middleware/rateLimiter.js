/**
 * Rate limiters: a general one for all API routes, and a stricter
 * one specifically for AI generation endpoints (which are expensive).
 */
const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const generalLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

const aiLimiter = rateLimit({
  windowMs: env.rateLimit.aiWindowMs,
  max: env.rateLimit.aiMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI generation limit reached. Please try again later.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many auth attempts. Please try again later.',
  },
});

module.exports = { generalLimiter, aiLimiter, authLimiter };
