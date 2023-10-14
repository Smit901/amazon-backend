const Order = require('../../models/order')
const Webhook = require('../../models/webhook')
const db = require('../../models/index')
require('dotenv').config()
const { validationResult } = require('express-validator')

const {
  currency,
  statementDescriptorSuffix
} = require('../../util/constants')

const stripe = require('stripe')(process.env.SECRET_KEY)

exports.getPublishablekey = (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  })
}

exports.initiatePayment = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg)
    return res.status(400).json({ errors: errorMessages })
  }
  console.log(req.body)

  const { orderId } = req.body

  // checking if the order exists of particular id
  const orderExisted = await Order(
    db.sequelize,
    db.Sequelize.DataTypes
  ).findOne({ where: { id: orderId } })

  if (!orderExisted) {
    res.status(404).json({ message: 'Invalid input and Order not found' })
  }

  const amount = orderExisted.total_price * 100

  // creating the payment intent for stripe
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      statement_descriptor_suffix: statementDescriptorSuffix,
      payment_method_types: ['card'],
      setup_future_usage: 'off_session',
      payment_method_options: {
        card: {
          mandate_options: {
            reference: 'mandate',
            description: 'customer',
            amount_type: 'fixed',
            amount: 1999,
            start_date: '1675238400',
            interval: 'day',
            interval_count: 1,
            supported_types: ['india']
          }
        }
      },
      statement_descriptor: 'Software develop'
    })

    const orderUpdate = await Order(
      db.sequelize,
      db.Sequelize.DataTypes
    ).update({ transaction_id: paymentIntent.id }, { where: { id: orderId } })

    if (!orderUpdate) {
      res.status(400).json({})
    }

    res.status(200).json({
      message: 'Payment initiated successfully',
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id
    })
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message
      }
    })
  }
}

exports.webHooks = async (req, res) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const payload = req.rawBody

  let event
  const headers = req.headers['stripe-signature']

  try {
    event = await stripe.webhooks.constructEvent(payload, headers, secret)
  } catch (error) {
    addWebhooklogs('Error in creating webhook')
    return res.status(400).json('webhook catch')
  }

  const orderExisted = await Order(db.sequelize,
    db.Sequelize.DataTypes).findOne({ where: { transaction_id: event.data.object.id } })

  if (!orderExisted) {
    res.status(404).json('Order Not found')
  }

  async function addStatusInOrder (stat) {
    await Order(
      db.sequelize,
      db.Sequelize.DataTypes
    ).update({ status: stat }, { where: { id: orderExisted.id } })
  }

  async function addWebhooklogs (data) {
    await Webhook(
      db.sequelize,
      db.Sequelize.DataTypes
    ).create({
      order_id: orderExisted.id, action_description: data
    })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      addStatusInOrder('Paid')
      addWebhooklogs('PaymentIntent was successful')
      break
    }
    case 'payment_intent.created': {
      addStatusInOrder('Paid')
      addWebhooklogs('PaymentIntent was created successfully')
      break
    }
    case 'payment_intent.payment_failed': {
      addStatusInOrder('Failed')
      addWebhooklogs('PaymentIntent was failed')
      break
    }
    case 'payment_intent.partially_funded': {
      addStatusInOrder('Failed')
      addWebhooklogs('partially funded')
      break
    }
    case 'payment_intent.requires_action': {
      addStatusInOrder('Failed')
      addWebhooklogs('Requires action while triggering')
      break
    }
    default:
      addStatusInOrder('Failed')
      addWebhooklogs('payment failed')
      break
  }
  res.json({ received: true })
}
