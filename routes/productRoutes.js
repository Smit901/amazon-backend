const express = require('express')
const router = express.Router()
const {
  addProduct,
  updateProducts,
  deleteProduct
} = require('../controllers/products/adminProductControllers')
const upload = require('../multerConfig.js')
const asyncRouteHandler = require('../util/asyncRouteHandler')
const { getAllProducts, searchProducts } = require('../controllers/products/productController')

router.get('/', getAllProducts)

router.post('/add-product', upload.single('productImage'), asyncRouteHandler(addProduct))

router.patch('/edit-product/:id', upload.single('productImage'), asyncRouteHandler(updateProducts))

router.delete('/delete-product/:id', asyncRouteHandler(deleteProduct))

router.get('/search', searchProducts)

module.exports = router
