const express = require('express');
const controller = require('../controllers/profile.controller');
const { updateProfileValidator } = require('../validators/profile.validator');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', controller.getProfile);
router.put('/', updateProfileValidator, validateRequest, controller.updateProfile);

module.exports = router;
