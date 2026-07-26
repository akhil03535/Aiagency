const express = require('express');
const authController = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  registerValidator,
  validateRequest,
  authController.register
);

router.post('/login', authLimiter, loginValidator, validateRequest, authController.login);

router.post('/logout', protect, authController.logout);

router.get('/me', protect, authController.getMe);

module.exports = router;
