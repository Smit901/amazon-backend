const express = require('express')
const {
  viewAllOrder,
  updateOrderStatus
} = require('../controllers/orders/adminOrdersController')
const asyncRouteHandler = require('../util/asyncRouteHandler')
const { placeOrder } = require('../controllers/order')
const router = express.Router()

router.get('/', asyncRouteHandler(viewAllOrder))

router.post('/add-order', placeOrder)

router.patch('/update-order-status/:id', asyncRouteHandler(updateOrderStatus))

module.exports = router
