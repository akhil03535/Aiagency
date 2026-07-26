/**
 * Auth controller. Thin — parses request, delegates to authService,
 * shapes the response. All routes here are wrapped with asyncHandler
 * so thrown errors reach the centralized error handler automatically.
 */
const asyncHandler = require('express-async-handler');
const env = require('../config/env');
const { success } = require('../utils/apiResponse');
const authService = require('../services/authService');

const REFRESH_COOKIE_NAME = 'refreshToken';

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.registerUser({
    name,
    email,
    password,
  });

  setRefreshCookie(res, refreshToken);

  return success(res, {
    statusCode: 201,
    message: 'Account created successfully',
    data: { user, accessToken },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser({
    email,
    password,
  });

  setRefreshCookie(res, refreshToken);

  return success(res, {
    message: 'Logged in successfully',
    data: { user, accessToken },
  });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user.id);
  res.clearCookie(REFRESH_COOKIE_NAME);
  return success(res, { message: 'Logged out successfully' });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  return success(res, { message: 'Current user fetched', data: { user } });
});

module.exports = { register, login, logout, getMe };
