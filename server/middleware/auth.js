/**
 * JWT authentication + role-based authorization middleware.
 */
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../config/prisma');
const { AppError } = require('./errorHandler');

/**
 * Verifies the access token from the Authorization header
 * and attaches the authenticated user to req.user.
 */
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Not authorized. Please log in.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwt.secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new AppError('User no longer exists or is deactivated.', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Restricts a route to specific roles.
 * Usage: restrictTo('ADMIN')
 */
function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
}

module.exports = { protect, restrictTo };
