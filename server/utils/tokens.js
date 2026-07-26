/**
 * JWT access/refresh token helpers. Used by auth controllers in Phase 2.
 */
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signAccessToken(userId) {
  return jwt.sign({ userId }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}

function signRefreshToken(userId) {
  return jwt.sign({ userId }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}

module.exports = { signAccessToken, signRefreshToken, verifyRefreshToken };
