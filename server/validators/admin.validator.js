const { body } = require('express-validator');

const templateValidator = [
  body('name').trim().notEmpty().withMessage('Template name is required'),
  body('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must be lowercase letters, numbers, and hyphens only'),
  body('businessType').trim().notEmpty().withMessage('Business type is required'),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body('categoryId').optional({ checkFalsy: true }).isUUID(),
  body('promptHints').optional().isObject(),
];

module.exports = { templateValidator };
