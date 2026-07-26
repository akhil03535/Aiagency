const express = require('express');
const controller = require('../controllers/businessProfile.controller');
const { businessProfileValidator } = require('../validators/businessProfile.validator');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', controller.list);
router.post('/', businessProfileValidator, validateRequest, controller.create);
router.get('/:id', controller.getOne);
router.put('/:id', businessProfileValidator, validateRequest, controller.update);
router.delete('/:id', controller.remove);
router.patch('/:id/set-default', controller.setDefault);

module.exports = router;
