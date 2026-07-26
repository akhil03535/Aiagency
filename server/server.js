/**
 * Server entry point. Binds the Express app to a port and
 * handles graceful shutdown + unhandled error safety nets.
 */
const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const prisma = require('./config/prisma');

const server = app.listen(env.port, () => {
  logger.info(`🚀 AI Agency API running on port ${env.port} [${env.nodeEnv}]`);
});

// --- Graceful shutdown ---
async function shutdown(signal) {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Server closed. Prisma disconnected.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// --- Safety nets ---
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', { reason });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', { message: err.message, stack: err.stack });
  process.exit(1);
});

module.exports = server;
