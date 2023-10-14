const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const emailFunc = require('../controllers/email')

require('dotenv').config()

exports.transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

exports.mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'amazon',
    link: 'http://example.com/'
  }
})

exports.mailOptions = (to, subject, emailBody) => {
  return {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: emailBody
  }
}

exports.sendEmailNotification = (body) => {
  const data = body.data
  switch (body.type) {
    case 'ORDER_CONFIRMATION':
      emailFunc.orderConfirmation(data.to, 'Order Confirmation - Your Recent Purchase', data.userName, data.orderNum, data.orderDate, data.shippingAddress, data.productData, data.orderTotal, data.paymentMethod, data.estimatedDeliveryDate)
      break
    case 'SHIPPING_UPDATE':
      emailFunc.shippingUpdates(data.to, 'Shipping Updates', data.userName, data.orderNum, data.shippingDate, data.estimatedDeliveryDate)
      break
    case 'RESET_PASSWORD':
      emailFunc.resetPassword(data.to, 'Password Reset Request - amazon', data.userName, data.link, data.expLimit)
      break
    case 'RESET_PASSWORD_CONFIRMATION':
      emailFunc.resetPasswordConfirmation(data.to, 'Password Reset Confirmation', data.userName)
      break
    default:
      break
  }
}
