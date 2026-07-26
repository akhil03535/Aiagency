const express = require('express');
const controller = require('../controllers/admin.controller');
const { templateValidator } = require('../validators/admin.validator');
const validateRequest = require('../middleware/validateRequest');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.use(protect, restrictTo('ADMIN'));

router.get('/dashboard', controller.getDashboard);

router.get('/users', controller.listUsers);
router.patch('/users/:id/status', controller.setUserActiveStatus);
router.patch('/users/:id/role', controller.setUserRole);

router.get('/logs', controller.listActivityLogs);

router.post('/templates', templateValidator, validateRequest, controller.createTemplate);
router.put('/templates/:id', controller.updateTemplate);
router.delete('/templates/:id', controller.deleteTemplate);

module.exports = router;
