const Product = require('../../models/products')
const { sequelize, Sequelize } = require('../../models/index')
const Adminlog = require('../../models/adminAuditLog')
const db = require('../../models/index')

exports.getAllProducts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const productsPerPage = parseInt(req.query.productsPerPage) || 10
  const offset = (page - 1) * productsPerPage
  try {
    Product(sequelize, Sequelize.DataTypes).findAll({
      offset,
      limit: productsPerPage
    })
      .then(async (products) => {
        await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
          admin_id: req.user.id,
          action_description: 'Fetched All Products'
        })
        res.json({ products, page, productsPerPage })
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
        res.status(500).json({ error: 'An error occurred while fetching products.' })
      })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'An error occurred while fetching products.' })
  }
}

exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params

    const product = await Product(sequelize, Sequelize.DataTypes).findByPk(productId)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.status(200).json(product)
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    res.status(500).json({ error: 'An error occurred while fetching the product.' })
  }
}

exports.searchProducts = async (req, res, next) => {
  const { query } = req
  const { Op } = require('sequelize')
  const page = parseInt(req.query.page) || 1
  const productsPerPage = parseInt(req.query.productsPerPage) || 10
  const offset = (page - 1) * productsPerPage
  try {
    Product(sequelize, Sequelize.DataTypes).findAll({
      where: { name: { [Op.like]: `%${query.name}%` } },
      // [Op.or]: [, { description: { [Op.like]: `%${query.description}%` } }]
      offset,
      limit: productsPerPage
    })
      .then(async (products) => {
        await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
          admin_id: req.user.id,
          action_description: `Product with Paramerter${query.name} Searched`
        })
        res.status(200).json({ products, page, productsPerPage })
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
        res.status(500).json({ error: 'An error occurred while fetching products.' })
      })
  } catch (error) {
    console.error('Error searching for products:', error)
    res.status(500).json({ error: 'An error occurred while searching for products.' })
  }
}

exports.addProduct = async (req, res) => {
  try {
    const [{ name, description, price, stock, ratings, image }] = req.body
    console.log(name, description, price, stock, ratings, image)
    const newProduct = await Product(sequelize, Sequelize.DataTypes).bulkCreate({
      name,
      description,
      price,
      stock,
      ratings,
      image,
      created_at: new Date()
    })
    res.status(201).json(newProduct)
  } catch (error) {
    console.error('Error adding product:', error)
    res.status(500).json({ error: 'An error occurred while adding the product.' })
  }
}
