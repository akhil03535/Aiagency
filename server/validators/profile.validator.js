const { body } = require('express-validator');

const updateProfileValidator = [
  body('name')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('avatarUrl').optional({ checkFalsy: true }).trim().isURL().withMessage('Avatar must be a valid URL'),
];

module.exports = { updateProfileValidator };
