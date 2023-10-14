const Order = require('../../models/order')
const db = require('../../models/index')
const Adminlog = require('../../models/adminAuditLog')
const User = require('../../models/user')

exports.viewAllOrder = async (req, res) => {
  const allorders = await Order(db.sequelize, db.Sequelize.DataTypes).findAll()
  if (allorders) {
    await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
      admin_id: req.user.id,
      action_description: 'All Orders List Fetched'
    })
  } else {
    throw new Error('No data found')
  }
  res.status(200).json({ msg: 'All orders fetched', allOrders: allorders })
}

exports.updateOrder = async (req, res) => {
  const { id, status, totalPrice, paymentMethod, userId, shippingAddressId } =
    req.body
  const orderId = req.params.id
  const updateOrder = await Order(db.sequelize, db.Sequelize.DataTypes).update(
    { id, status, totalPrice, paymentMethod, userId, shippingAddressId },
    { where: { id: orderId } }
  )
  if (updateOrder[0] === 1) {
    await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
      admin_id: req.user.id,
      action_description: `Order with id-${orderId} Updated`
    })
    res.status(200).json({ msg: 'Order Updated', updatedOrder: updateOrder })
  } else {
    throw new Error('Order Updation failed')
  }
}

exports.addOrder = async (req, res) => {
  const { status, totalPrice, paymentMethod, userId, shippingAddressId } =
    req.body
  const newOrder = await Order(db.sequelize, db.Sequelize.DataTypes).create({
    status,
    total_price: totalPrice,
    payment_method: paymentMethod,
    user_id: userId,
    shipping_address_id: shippingAddressId,
    order_date: new Date()
  })
  if (newOrder) {
    await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
      admin_id: req.user.id,
      action_description: 'New Order created'
    })
    res.status(201).json({ msg: 'Order Added', newOrder })
  } else {
    throw new Error('Adding order Failed')
  }
}

exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id
  const deletedOrder = await Order(
    db.sequelize,
    db.Sequelize.DataTypes
  ).destroy({ where: { id: orderId } })
  if (deletedOrder === 1) {
    await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
      admin_id: req.user.id,
      action_description: `Order with id-${orderId} Deleted`
    })
    res
      .status(200)
      .json({ message: 'Order Deleted', deletedOrder })
  } else {
    throw new Error('Deletion Failed')
  }
}

exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id
  const { newStatus } = req.body
  const orderData = await Order(db.sequelize, db.Sequelize.DataTypes).findOne({
    where: { id: orderId }
  })
  if (orderData.id && orderData.UserId) {
    const userData = await User(db.sequelize, db.Sequelize.DataTypes).findOne({
      where: { id: orderData.UserId }
    })
    if (userData) {
      const shippingDate = new Date(orderData.order_date)
      shippingDate.setDate(shippingDate.getDate() + 2)
      const estimatedDelieveryDate = new Date(shippingDate)
      estimatedDelieveryDate.setDate(shippingDate.getDate() + 7)
      await Order(db.sequelize, db.Sequelize.DataTypes).update(
        { status: newStatus },
        { where: { id: orderId } }
      )
      res
        .status(200)
        .json({ msg: 'Order status Updated' })
    } else {
      throw new Error('User not found')
    }
  } else {
    throw new Error('order does not exists')
  }
}
