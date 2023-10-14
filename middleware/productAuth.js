const Product = require('../models/products')
const db = require('../models/index')
const authenticateProduct = async (req, res, next) => {
  try {
    const { ProductId } = req.body
    const product = await Product(db.sequelize, db.Sequelize.DataTypes).findOne({ where: { id: ProductId } })
    if (!product) {
      const error = new Error(`Product ${ProductId} is not found.`)
      error.statusCode = 400
      throw error
    }
    if (product.stock === 0) {
      const error = new Error(`Product ${ProductId} is out of stock`)
      error.statusCode = 400
      throw error
    }
    req.product = product
    next()
  } catch (error) {
    error.statusCode = 401
    next(error)
  }
}

module.exports = { authenticateProduct }
