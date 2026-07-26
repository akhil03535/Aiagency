/**
 * Express app configuration.
 * Separated from server.js so the app can be imported directly
 * in tests (supertest) without binding to a port.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const xssClean = require('xss-clean');

const env = require('./config/env');
const logger = require('./config/logger');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// --- Security headers ---
app.use(helmet());

// --- CORS ---
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

// --- Body parsing ---
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// --- Sanitization ---
app.use(xssClean()); // strips known XSS patterns from body/query/params
app.use(hpp()); // prevents HTTP parameter pollution

// --- Logging ---
if (env.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// --- Static files (uploaded logos, avatars, etc.) ---
app.use('/uploads', express.static('uploads'));

// --- Rate limiting (applies to all /api routes) ---
app.use('/api', generalLimiter);

// --- Routes ---
app.use('/api', routes);

// --- 404 + error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
