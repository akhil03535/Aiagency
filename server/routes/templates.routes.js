const express = require('express');
const controller = require('../controllers/templates.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', controller.list);
router.get('/categories', controller.listCategories);
router.get('/:id', controller.getOne);

module.exports = router;
