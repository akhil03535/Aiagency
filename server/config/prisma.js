/**
 * Prisma client singleton.
 * Prevents exhausting the DB connection pool from hot-reloading
 * in development by reusing a single instance across the app.
 */
const { PrismaClient } = require('@prisma/client');
const env = require('./env');

const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.isDevelopment ? ['warn', 'error'] : ['error'],
  });

if (env.isDevelopment) {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
