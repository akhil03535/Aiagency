/**
 * Auth service — all password hashing, user lookup, and token issuance
 * logic lives here. Controllers stay thin and only orchestrate.
 */
const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const env = require('../config/env');
const { AppError } = require('../middleware/errorHandler');
const { signAccessToken, signRefreshToken } = require('../utils/tokens');

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  isActive: true,
  createdAt: true,
};

async function registerUser({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, env.bcrypt.saltRounds);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      // First-ever user becomes ADMIN automatically so there's always
      // at least one admin account without manual DB editing.
      role: (await prisma.user.count()) === 0 ? 'ADMIN' : 'USER',
    },
    select: safeUserSelect,
  });

  // Every user gets a default Settings row.
  await prisma.settings.create({ data: { userId: user.id } });

  await logActivity(user.id, 'REGISTER', 'User registered');

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

  return { user, accessToken, refreshToken };
}

async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Use a generic message for both "no user" and "wrong password" so we
  // don't leak which emails are registered.
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (!user.isActive) {
    throw new AppError('This account has been deactivated.', 403);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password.', 401);
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

  await logActivity(user.id, 'LOGIN', 'User logged in');

  const { password: _pw, refreshToken: _rt, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
}

async function logoutUser(userId) {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
  await logActivity(userId, 'LOGOUT', 'User logged out');
}

async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: safeUserSelect,
  });
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
}

/**
 * Fire-and-forget activity log write. Never throws — a logging failure
 * should never break the auth flow itself.
 */
async function logActivity(userId, action, description) {
  try {
    await prisma.activityLog.create({
      data: { userId, action, description },
    });
  } catch (_err) {
    // Intentionally swallowed — logging is best-effort.
  }
}

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser };
