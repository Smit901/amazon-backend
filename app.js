const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

// const usersRouter = require('./routes/users')
// const orderRouter = require('./routes/order')
const paymentRouter = require('./routes/payment')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(logger('dev'))
// app.use(express.json())
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// routes
// app.use('/users', usersRouter)
// app.use('/order', orderRouter)

// const { sendEmailNotification } = require('./util/email')
const usersRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderManagementRoutes')
const authRoutes = require('./routes/authRoutes.js')
const { isAdmin, requireSignIn } = require('./middleware/authMiddleware')
const errorHandler = require('./util/errorHandler')
const productRouter = require('./routes/productRouter')
const cartRouter = require('./routes/cart')
const orderRouter = require('./routes/order')
const userRoutes = require('./routes/userRoutes.js')
const upload = require('./multerConfig.js')

// const productData = [
//   {
//     item: 'Product 1',
//     description: 'Description of Product 1',
//     price: '$99.99',
//     quantity: '1',
//     total: '$99.99'
//   },
//   {
//     item: 'Product 2',
//     description: 'Description of Product 2',
//     price: '$49.99',
//     quantity: '2',
//     total: '$99.98'
//   }
// ]

// const body1 = {
//   type: 'ORDER_CONFIRMATION',
//   data: {
//     to: 'dudhatsmit174@gmail.com',
//     userName: 'Smit Dudhat',
//     orderNum: 1,
//     orderDate: new Date().toISOString(),
//     shippingAddress: 'djhjhjhjhj',
//     productData,
//     orderTotal: 1000,
//     paymentMethod: 'card',
//     estimatedDeliveryDate: new Date().toISOString()
//   }
// }

// const body2 = {
//   type: 'SHIPPING_UPDATE',
//   data: {
//     to: 'dudhatsmit174@gmail.com',
//     userName: 'Smit Dudhat',
//     orderNum: 1,
//     shippingDate: new Date().toISOString(),
//     estimatedDeliveryDate: new Date().toISOString()
//   }
// }

// const body3 = {
//   type: 'RESET_PASSWORD',
//   data: {
//     to: 'dudhatsmit174@gmail.com',
//     userName: 'Smit Dudhat',
//     link: 'http://example.com/',
//     expLimit: '20min'
//   }
// }

// const body4 = {
//   type: 'RESET_PASSWORD_CONFIRMATION',
//   data: {
//     to: 'dudhatsmit174@gmail.com',
//     userName: 'Smit Dudhat'
//   }
// }

// sendEmailNotification(body4)

// orderConfirmation('dudhatsmit174@gmail.com', 'Order Confirmation - Your Recent Purchase', 'Smit Dudhat', 1, new Date().toISOString(), 'Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016', productData, 1000, 'credit card', new Date().toISOString())
// shippingUpdates('dudhatsmit174@gmail.com', 'Shipping Updates', 'Smit Dudhat', 1, new Date().toISOString(), new Date().toISOString())
// resetPassword('dudhatsmit174@gmail.com', 'Password Reset Request - amazon', 'Smit Dudhat', 'http://example.com/', '20 min')
// resetPasswordConfirmation('dudhatsmit174@gmail.com', 'Password Reset Confirmation', 'Smit Dudhat')
app.use('/api/admin/users', requireSignIn, isAdmin, usersRoutes)
app.use('/api/admin/products', requireSignIn, isAdmin, productRoutes)
app.use('/api/admin/order', requireSignIn, isAdmin, orderRoutes)

app.use('/api/cart', requireSignIn, cartRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', requireSignIn, orderRouter)
app.use('/api/auth', upload.single('profilePicture'), authRoutes)
app.use('/api/users', upload.single('profilePicture'), userRoutes)
app.use('/api/payment', paymentRouter)

app.use(function (req, res, next) {
  next(createError(404))
})
app.use(errorHandler)

app.use(errorHandler)

// error handler
app.use(function (err, req, res, next) {
  const status = err.statusCode || 400
  const message = err.message
  const data = err.data
  res.status(status).json({
    message,
    data
  })
})
module.exports = app
