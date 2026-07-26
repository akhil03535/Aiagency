# Validators

Each route group gets its own validator file using `express-validator`,
e.g. `auth.validator.js`, `generation.validator.js`, `businessProfile.validator.js`.

Pattern:

```js
const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

module.exports = { registerValidator };
```

Then in the route file:

```js
router.post('/register', registerValidator, validateRequest, authController.register);
```

Validator files are added starting in Phase 2 (Authentication).
