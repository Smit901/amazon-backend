const Cart = require('../../models/cart')
const CartItem = require('../../models/cartItem')
const Product = require('../../models/products')
const db = require('../../models/index')
const addCart = async (req, res) => {
  const { quantity } = req.body
  const user = req.user
  const product = req.product

  let cart = await Cart(db.sequelize, db.Sequelize.DataTypes).findOne({
    where: { UserId: user.id }
  })
  if (!cart) {
    cart = await Cart(db.sequelize, db.Sequelize.DataTypes).create({
      UserId: user.id
    })
  }
  const cartItem = await CartItem(db.sequelize, db.Sequelize.DataTypes).findOne(
    { where: { ProductId: product.id, cartId: cart.id } }
  )

  if (cartItem) {
    const updatedPrice = cartItem.total_price + product.price * quantity
    const updatedQuantity = cartItem.quantity + quantity
    await CartItem(db.sequelize, db.Sequelize.DataTypes).update(
      {
        quantity: updatedQuantity,
        total_price: updatedPrice
      },
      { where: { CartId: cart.id, ProductId: product.id } }
    )
  } else {
    await CartItem(db.sequelize, db.Sequelize.DataTypes).create({
      CartId: cart.id,
      ProductId: product.id,
      quantity,
      total_price: product.price * quantity
    })
  }
  res.status(200).json({ message: 'Item added to the cart successfully.' })
}

const removeCart = async (req, res) => {
  const user = req.user
  const product = req.product

  const cart = await Cart(db.sequelize, db.Sequelize.DataTypes).findOne({
    where: { UserId: user.id }
  })
  if (!cart) {
    const error = new Error('Cart not found')
    error.statusCode = 400
    throw error
  }
  const cartItem = await CartItem(db.sequelize, db.Sequelize.DataTypes).findOne(
    { where: { ProductId: product.id, CartId: cart.id } }
  )
  if (!cartItem) {
    const error = new Error('Product does not exist in the cart')
    error.statusCode = 400
    throw error
  }
  await CartItem(db.sequelize, db.Sequelize.DataTypes).destroy({
    where: { CartId: cart.id, ProductId: product.id }
  })
  res.status(200).json({ message: 'item removed from the cart successfully.' })
}

const removeAllCart = async (req, res) => {
  const user = req.user
  const cart = await Cart(db.sequelize, db.Sequelize.DataTypes).findOne({
    where: { UserId: user.id }
  })
  if (!cart) {
    const error = new Error('Cart is Empty')
    error.statusCode = 404
    throw error
  }
  await CartItem(db.sequelize, db.Sequelize.DataTypes).destroy({
    where: { CartId: cart.id }
  })
  await Cart(db.sequelize, db.Sequelize.DataTypes).destroy({
    where: { id: cart.id }
  })

  return res.status(200).json({ message: 'Cart emptied successfully' })
}

const updateCart = async (req, res) => {
  const { quantity } = req.body

  const user = req.user
  const product = req.product

  if (quantity <= 0) {
    const error = new Error(`Product ${product.id} quantity is Invalid`)
    error.statusCode = 400
    throw error
  }
  const cart = await Cart(db.sequelize, db.Sequelize.DataTypes).findOne({
    where: { UserId: user.id }
  })
  if (!cart) {
    const error = new Error('Cart not found')
    error.statusCode = 400
    throw error
  }

  const cartItem = await CartItem(db.sequelize, db.Sequelize.DataTypes).findOne(
    { where: { ProductId: product.id, CartId: cart.id } }
  )
  if (!cartItem) {
    const error = new Error('Product does not exist in the cart')
    error.statusCode = 400
    throw error
  }
  await CartItem(db.sequelize, db.Sequelize.DataTypes).update(
    { quantity, total_price: product.price * quantity },
    { where: { CartId: cart.id, ProductId: product.id } }
  )
  res
    .status(200)
    .json({ message: 'item quantity updated in the cart successfully' })
}

const getCart = async (req, res) => {
  const user = req.user
  const cart = await Cart(db.sequelize, db.Sequelize.DataTypes).findOne({
    where: { UserId: user.id }
  })

  if (!cart) {
    const error = new Error('Cart not found')
    error.statusCode = 400
    throw error
  }

  const cartItems = await CartItem(
    db.sequelize,
    db.Sequelize.DataTypes
  ).findAll({ where: { CartId: cart.id } })
  if (!cartItems || cartItems.length === 0) {
    const error = new Error('Product does not exist in the cart')
    error.statusCode = 400
    throw error
  }

  let totalQuantity = 0
  let totalAmount = 0
  const cartItemDetails = []
  for (const cartItem of cartItems) {
    const product = await Product(db.sequelize, db.Sequelize.DataTypes).findOne(
      { where: { id: cartItem.ProductId } }
    )
    const itemTotalPrice = cartItem.quantity * product.price

    totalQuantity += cartItem.quantity
    totalAmount += itemTotalPrice

    cartItemDetails.push({
      product_id: product.id,
      product_name: product.name,
      quantity: cartItem.quantity,
      price_per_unit: product.price
    })
  }

  res.json({
    message: 'Cart contents retrieved successfully.',
    cart_items: cartItemDetails,
    total_price: totalAmount,
    total_quantity: totalQuantity
  })
}

const checkout = async (req, res) => {
  const user = req.user
  const cart = await Cart(db.sequelize, db.Sequelize).findOne({
    where: { UserId: user.id }
  })
  if (!cart) {
    const error = new Error('Cart is empty')
    error.statusCode = 400
    throw error
  }
  res
    .status(200)
    .json({
      message: 'Order placed successfully. Redirect to payment gateway.'
    })
}

module.exports = {
  addCart,
  removeCart,
  updateCart,
  getCart,
  removeAllCart,
  checkout
}
