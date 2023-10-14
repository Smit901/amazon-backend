const { body } = require('express-validator')

const initiateValidation = [
  body('orderId')
    .trim()
    .notEmpty()
    .withMessage('orderId is required')
    .isNumeric()
    .withMessage('orderId must be number')
]

const callbackValidation = [
  body('orderId')
    .trim()
    .notEmpty()
    .withMessage('orderId is required')
    .isNumeric()
    .withMessage('orderId must be number'),
  body('transactionId')
    .trim()
    .notEmpty()
    .withMessage('transactionId is required'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('status is required')
    .isIn(['success', 'failed', 'pending'])
    .withMessage('status must be success or failed or pending'),
  body('paymentMethod')
    .trim()
    .notEmpty()
    .withMessage('paymentMethod is required')
]

module.exports = { initiateValidation, callbackValidation }
