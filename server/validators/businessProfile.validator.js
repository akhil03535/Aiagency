/**
 * express-validator chains for business profile routes.
 */
const { body } = require('express-validator');

const TONE_VALUES = [
  'PROFESSIONAL',
  'CASUAL',
  'FRIENDLY',
  'FORMAL',
  'PLAYFUL',
  'LUXURY',
  'URGENT',
  'EMOTIONAL',
];

const businessProfileValidator = [
  body('businessName')
    .trim()
    .notEmpty()
    .withMessage('Business name is required')
    .isLength({ max: 150 })
    .withMessage('Business name must be under 150 characters'),
  body('businessType').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('website')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Website must be a valid URL'),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
  body('location').optional({ checkFalsy: true }).trim().isLength({ max: 200 }),
  body('audience').optional({ checkFalsy: true }).trim().isLength({ max: 300 }),
  body('brandTone')
    .optional({ checkFalsy: true })
    .isIn(TONE_VALUES)
    .withMessage(`Brand tone must be one of: ${TONE_VALUES.join(', ')}`),
  body('products').optional().isArray().withMessage('Products must be an array of strings'),
  body('services').optional().isArray().withMessage('Services must be an array of strings'),
  body('socialLinks').optional().isObject().withMessage('Social links must be an object'),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
];

module.exports = { businessProfileValidator };
