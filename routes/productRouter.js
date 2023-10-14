const express = require('express')
const router = express.Router()
const productController = require('../controllers/products/productController')

router.get('/', productController.getAllProducts)
router.get('/:productId', productController.getProductById)
router.get('/search', productController.searchProducts)
router.post('/add', productController.addProduct)

module.exports = router
