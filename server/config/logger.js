/**
 * Winston logger. Logs to console always; logs to file in production.
 */
const winston = require('winston');
const env = require('./env');

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.printf(
        ({ timestamp, level, message, ...meta }) =>
          `[${timestamp}] ${level}: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ''
          }`
      )
    ),
  }),
];

if (env.isProduction) {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

const logger = winston.createLogger({
  level: env.isDevelopment ? 'debug' : 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports,
});

module.exports = logger;
