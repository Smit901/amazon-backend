const JWT = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const userModel = require('../models/user')
const db = require('../models/index')

// Protected  routes
exports.requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      JWT_SECRET
    )
    req.user = decode
    next()
  } catch (error) {
    console.log(error)
  }
}

// admin access
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userModel(db.sequelize, db.Sequelize.DataTypes).findByPk(req.user.id)

    if (user.role !== 'ADMIN') {
      return res.status(401).send({
        success: false,
        message: 'Unauthorized Access'
      })
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    res.status(401).send({
      success: false,
      error,
      message: 'Error in Admin middleware '
    })
  }
}
