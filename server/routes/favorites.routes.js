const express = require('express');
const controller = require('../controllers/favorites.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', controller.list);
router.post('/:generationId', controller.add);
router.delete('/:generationId', controller.remove);

module.exports = router;
