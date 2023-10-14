const express = require('express')
const { initiatePayment, webHooks, confirmPayment, getPublishablekey } = require('../controllers/payment')
const router = express.Router()
// const { body } = require('express-validator')
const { callbackValidation, initiateValidation } = require('../middleware/validation')
const asyncRouteHandler = require('../util/asyncRouteHandler')

router.use(express.raw({ type: 'application/json' }))

router
  .get('/config', getPublishablekey)
  .post('/initiate', initiateValidation, asyncRouteHandler(initiatePayment))
  .post('/hooks', asyncRouteHandler(webHooks))
  .post('/callback', callbackValidation, asyncRouteHandler(confirmPayment))

module.exports = router
