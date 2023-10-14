const Product = require('../../models/product')
const db = require('../../models')

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, rating } = req.body
    if (stock <= 0) {
      return res.status(400).json({ error: 'Stock must be greater than zero' })
    }
    if (typeof rating !== 'number' || rating <= 1) {
      return res.status(400).json({ error: 'Invalid Rating' })
    }
    const newProduct = await Product(
      db.sequelize,
      db.Sequelize.DataTypes
    ).create({
      name,
      description,
      price,
      stock,
      rating
    })
    res.status(200).json({ newProduct })
  } catch (err) {
    res.status(500).json({ err })
  }
}
