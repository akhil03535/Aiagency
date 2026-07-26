const express = require('express');
const controller = require('../controllers/generation.controller');
const { generateValidator } = require('../validators/generation.validator');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(protect);

router.get('/content-types', controller.listContentTypes);
router.post('/', aiLimiter, generateValidator, validateRequest, controller.generate);
router.post('/:id/regenerate', aiLimiter, controller.regenerate);

module.exports = router;
