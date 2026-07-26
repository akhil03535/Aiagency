const { body } = require('express-validator');
const { getSupportedContentTypes } = require('../prompts');

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

const LENGTH_VALUES = ['short', 'medium', 'long'];

const generateValidator = [
  body('contentType')
    .trim()
    .notEmpty()
    .withMessage('contentType is required')
    .custom((value) => getSupportedContentTypes().includes(value))
    .withMessage(
      `contentType must be one of: ${getSupportedContentTypes().join(', ')}`
    ),
  body('topic')
    .trim()
    .notEmpty()
    .withMessage('topic is required')
    .isLength({ max: 500 })
    .withMessage('topic must be under 500 characters'),
  body('goal').optional({ checkFalsy: true }).trim().isLength({ max: 300 }),
  body('targetAudience').optional({ checkFalsy: true }).trim().isLength({ max: 300 }),
  body('tone').optional({ checkFalsy: true }).isIn(TONE_VALUES),
  body('length').optional({ checkFalsy: true }).isIn(LENGTH_VALUES),
  body('language').optional({ checkFalsy: true }).trim().isLength({ max: 50 }),
  body('offer').optional({ checkFalsy: true }).trim().isLength({ max: 300 }),
  body('keywords').optional().isArray(),
  body('callToAction').optional({ checkFalsy: true }).trim().isLength({ max: 200 }),
  body('businessProfileId').optional({ checkFalsy: true }).trim().isUUID(),
];

module.exports = { generateValidator };
