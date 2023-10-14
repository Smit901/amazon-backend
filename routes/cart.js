const express = require('express')

const {
  addCart,
  removeCart,
  updateCart,
  getCart,
  removeAllCart,
  checkout
} = require('../controllers/cart/index')
const asyncRouteHandler = require('../util/asyncRouteHandler')
const { authenticateProduct } = require('../middleware/ProductAuth')
const router = express.Router()

/* for the shopping cart we have to make 5 end points
1./api/cart/add - post
2./api/cart/remove -delete
3./api/cart/update -patch
4./api/cart --get
5. /api/cart/checkout --get and return
*/
router.get('/', asyncRouteHandler(getCart))
router.post('/add', authenticateProduct, asyncRouteHandler(addCart))
router.delete('/remove', authenticateProduct, asyncRouteHandler(removeCart))
router.delete('/removeAll', asyncRouteHandler(removeAllCart))
router.patch('/update', authenticateProduct, asyncRouteHandler(updateCart))
router.post('/checkout', asyncRouteHandler(checkout))

module.exports = router
