const Product = require('../../models/products')
const db = require('../../models/index')
const Adminlog = require('../../models/adminAuditLog')
const path = require('path')

exports.addProduct = async (req, res) => {
  const productImage = req.file
    ? path.join(__dirname, '../public/uploads/', req.file.filename)
    : null
  const { name, description, price, stock, ratings } = req.body
  const newProduct = await Product(db.sequelize, db.Sequelize.DataTypes).create(
    {
      name,
      description,
      price,
      stock,
      ratings,
      image: productImage
    }
  )
  if (newProduct) {
    await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
      admin_id: req.user.id,
      action_description: 'New Product Added'
    })
    res
      .status(201)
      .json({ message: 'Product Added Successfully', new_product: newProduct })
  } else {
    throw new Error('Adding order Failed')
  }
}

exports.viewAllProducts = async (req, res) => {
  const allProducts = await Product(
    db.sequelize,
    db.Sequelize.DataTypes
  ).findAll()
  if (allProducts) {
    await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
      admin_id: req.user.id,
      action_description: 'All Products List Fetched'
    })
    res.status(200).json({
      message: 'List of products retrieved successfully',
      allProducts
    })
  } else {
    throw new Error('No products found')
  }
}

exports.updateProducts = async (req, res) => {
  const productId = req.params.id
  const productImage = req.file
    ? path.join(__dirname, '../public/uploads/', req.file.filename)
    : null
  const { name, description, price, stock, ratings } = req.body
  const updateProduct = await Product(
    db.sequelize,
    db.Sequelize.DataTypes
  ).update(
    { name, description, price, stock, ratings, image: productImage },
    { where: { id: productId } }
  )
  if (updateProduct[0] === 1) {
    await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
      admin_id: req.user.id,
      action_description: `Product with id-${productId} Updated`
    })
    res.status(200).json({
      message: 'Product Updated Sucessfully',
      updatedProduct: updateProduct
    })
  } else {
    throw new Error('Product Updation failed')
  }
}

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id
  const deletedProduct = await Product(
    db.sequelize,
    db.Sequelize.DataTypes
  ).destroy({
    where: { id: productId }
  })
  if (deletedProduct === 1) {
    await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
      admin_id: req.user.id,
      action_description: `Product with id-${productId} Deleted`
    })
    res
      .status(200)
      .json({ message: 'Product Deleted', deleted_product: deletedProduct })
  } else {
    throw new Error('Deletion Failed')
  }
}
