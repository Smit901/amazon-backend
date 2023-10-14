const express = require('express')
// const { createOrder } = require('../controllers/order')
// const router = express.Router()
// const asyncRouteHandler = require('../util/asyncRouteHandler')

// router.post('/', asyncRouteHandler(createOrder))
const {
  placeOrder,
  getOrders,
  trackOrder
} = require('../controllers/order')
const router = express.Router()

router.post('/place', placeOrder)
router.get('/history/:userId', getOrders)
router.get('/track/:orderId', trackOrder)

module.exports = router
