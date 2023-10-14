// const { transporter, mailGenerator, mailOptions } = require('../../util/email')
const mailUtil = require('../../util/email')

const logger = require('../../util/logger')

exports.orderConfirmation = (to, subject, customerName, orderNum, orderDate, ShippingAddress, productData, orderTotal, paymentMethod, estimatedDeliveryDate) => {
  if (!to || !subject || !customerName || !orderNum || !orderDate || !ShippingAddress || !productData || !orderTotal || !paymentMethod || !estimatedDeliveryDate) {
    console.log(to, subject, customerName, orderNum, orderDate, ShippingAddress, productData, orderTotal, paymentMethod, estimatedDeliveryDate)
    logger.warn('orderConfirmation - Invalid Parameters')
    return
  }
  const email = {
    body: {
      name: customerName,
      intro: `We are thrilled to confirm your recent purchase on Your E-commerce Website!<br><br>
<b>Order Number:</b>${orderNum}<br>
<b>Order Date:</b>${orderDate.split('T')[0]}<br>
<b>Delivery Address:</b>${ShippingAddress}<br><br>`,
      table: {
        data: productData.map(item => { return item }),
        columns: {
          custom: {
            item: '<b>Item</b>',
            description: '<b>Description</b>',
            price: '<b>Price</b>',
            quantity: '<b>Quantity</b>',
            total: '<b>Total</b>'
          }
        }
      },
      outro: `<b>Order Total:</b>${orderTotal}<br>  
              <b>Payment Method:</b>${paymentMethod}<br>
              <b>Estimated Delivery Date:</b>${estimatedDeliveryDate.split('T')[0]}<br><br>   
              We will notify you via email once your order has been shipped, and you can track its status.
              Please don't hesitate to reach out to our customer support team if you have any questions or need assistance.<br><br> 
              Thank you for shopping with us! We value your business and look forward to serving you again in the future.<br><br>`
    }
  }
  const emailBody = mailUtil.mailGenerator.generate(email)

  mailUtil.transporter.sendMail(mailUtil.mailOptions(to, subject, emailBody), (error, info) => {
    if (error) {
      logger.error('orderConfirmation - Email could not be sent')
    } else {
      logger.info('orderConfirmation - Email sent successfully')
    }
  })
}

exports.shippingUpdates = (to, subject, customerName, orderNum, shippingDate, estimatedDeliveryDate) => {
  console.log(to, subject, customerName, orderNum, shippingDate, estimatedDeliveryDate)
  if (!to || !subject || !customerName || !orderNum || !shippingDate || !estimatedDeliveryDate) {
    logger.warn('shippingUpdates - Invalid Parameters')
    return
  }
  const email = {
    body: {
      name: customerName,
      intro: `We wanted to inform you that your order with Order Number ${orderNum} has been shipped and is on its way to you. Here are the shipping details:<br><br>
              <b>Order Number:</b>${orderNum}<br>
              <b>Shipping Date:</b>${shippingDate.split('T')[0]}<br>
              <b>Estimated Delivery Date:</b>${estimatedDeliveryDate.split('T')[0]}<br><br>`,
      outro: `If you have any questions or need assistance with your order, please don't hesitate to contact our customer support team. We are here to help.<br><br>
              Thank you for choosing amazon. We appreciate your business and hope you enjoy your purchase.<br><br>
              Best regards,<br>`
    }
  }

  const emailBody = mailUtil.mailGenerator.generate(email)

  mailUtil.transporter.sendMail(mailUtil.mailOptions(to, subject, emailBody), (error, info) => {
    if (error) {
      logger.error('shippingUpdates - Email could not be sent')
    } else {
      logger.info('shippingUpdates - Email sent successfully')
    }
  })
}

exports.resetPassword = (to, subject, customerName, resetLink, expLimit) => {
  if (!to || !subject || !customerName || !resetLink || !expLimit) {
    logger.warn('resetPassword - Invalid Parameters')
    return
  }
  const email = {
    body: {
      name: customerName,
      intro: `We have received a request to reset the password 
              for your amazon account. 
              If you did not make this request, please disregard 
              this email.<br><br>`,
      action: {
        instructions: 'To reset your password, click on the following link or copy and paste it into your browser\'s address bar:',
        button: {
          color: '#22BC66',
          text: 'Reset Your Password',
          link: resetLink
        }
      },
      outro: `Please note that this link is valid for a limited time for security reasons. If you do not reset your password within ${expLimit}, you may need to request another password reset.<br><br>
              If you have any questions or need assistance, please contact our customer support team. We're here to help you.<br><br>
              Thank you for being a valued member of amzon.<br><br>`
    }
  }

  const emailBody = mailUtil.mailGenerator.generate(email)

  mailUtil.transporter.sendMail(mailUtil.mailOptions(to, subject, emailBody), (error, info) => {
    if (error) {
      logger.error('resetPassword - Email could not be sent')
    } else {
      logger.info('resetPassword - Email sent successfully')
    }
  })
}

exports.resetPasswordConfirmation = (to, subject, customerName) => {
  if (!to || !subject || !customerName) {
    logger.warn('resetPasswordConfirmation - Invalid Parameters')
    return
  }
  const email = {
    body: {
      name: customerName,
      intro: `Your password has been successfully reset for your account 
              at amazon.<br><br>`,
      outro: `If you have any questions or need further assistance, please don't hesitate to contact our customer support team.<br><br>
              Thank you for choosing amazon.<br><br>`
    }
  }
  const emailBody = mailUtil.mailGenerator.generate(email)

  mailUtil.transporter.sendMail(mailUtil.mailOptions(to, subject, emailBody), (error, info) => {
    if (error) {
      logger.error('resetPasswordConfirmation - Email could not be sent')
    } else {
      logger.info('resetPasswordConfirmation - Email sent successfully')
    }
  })
}
