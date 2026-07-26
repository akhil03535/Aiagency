const express = require('express');
const controller = require('../controllers/history.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', controller.list);
router.get('/reuse/:generationId', controller.getReusable);
router.delete('/:id', controller.remove);

module.exports = router;
