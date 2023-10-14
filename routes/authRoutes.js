const express = require('express')
const {
  registerController,
  loginController,
  verifyTokenController
} = require('../controllers/user/index')
const router = express.Router()
const asyncRouteHandler = require('../util/asyncRouteHandler')
const { check } = require('express-validator')
// register
router.post('/register', [
  check('firstName').notEmpty().withMessage('First name cannot be empty.'),
  check('lastName').optional(),
  check('email').isEmail().withMessage('Invalid email address.'),
  check('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
], asyncRouteHandler(registerController))

// login
router.post('/login', asyncRouteHandler(loginController))
// verification_token
router.get('/verify/:verificationToken', asyncRouteHandler(verifyTokenController))

module.exports = router
