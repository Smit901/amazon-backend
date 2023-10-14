require('dotenv').config()
const JWT = require('jsonwebtoken')
const path = require('path')
const { validationResult } = require('express-validator')
const User = require('../../models/user.js')
const db = require('../../models/index.js')
const {
  comparePwd,
  hashPassword,
  sendVerificationEmail
} = require('../../helpers/authHelper.js')
const { TOKEN_EXPIRY_DURATION, JWT_SECRET } = process.env
const Adminlog = require('../../models/adminAuditLog.js')

// RegisterController

exports.registerController = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const verificationToken = JWT.sign({ email }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY_DURATION
    })

    // Check if a file was uploaded
    const profilePicture = req.file
      ? path.join(__dirname, '../public/uploads/', req.file.filename)
      : null

    const existingUser = await User(
      db.sequelize,
      db.Sequelize.DataTypes
    ).findOne({ where: { email } })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await hashPassword(password)
    const user = await User(db.sequelize, db.Sequelize.DataTypes).create({
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword,
      verificationToken,
      profile_picture: profilePicture,
      role
    })

    if (req.user) {
      await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
        admin_id: req.user.id,
        action_description: 'New user with Added'
      })
    }

    res.status(201).send({
      success: true,
      message: 'User Registration successful. Please verify your email.',
      user
    })

    await sendVerificationEmail(email, verificationToken)
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message
    })
  }
}

// LoginController

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(401).send({
        success: false,
        message: 'Both Email and password are required.'
      })
    }
    const user = await User(db.sequelize, db.Sequelize.DataTypes).findOne({
      where: { email }
    })

    if (!user) {
      res.status(401).send({
        success: false,
        message: 'Invalid Email'
      })
    }

    const matchPwd = await comparePwd(password, user.password)
    if (!matchPwd) {
      res.status(401).send({
        success: false,
        message: 'Invalid Password'
      })
    }

    //  create token here
    const token = JWT.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY_DURATION
    })

    res.status(200).send({
      success: true,
      message: 'Login is successful',
      token
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Internal server error'
    })
  }
}

// GET USER
exports.getUserController = async (req, res) => {
  try {
    const user = await User(db.sequelize, db.Sequelize.DataTypes).findAll()

    if (!user || user.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).send({
      success: true,
      message: 'Data fetched successfully',
      user
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Internal server error'
    })
  }
}

// UPDATE USER
exports.updateUserController = async (req, res) => {
  try {
    const userId = req.params.id
    const { firstName, lastName } = req.body
    const profilePicture = req.file
      ? path.join(__dirname, '../public/uploads/', req.file.filename)
      : null
    const updatedRowCount = await User(
      db.sequelize,
      db.Sequelize.DataTypes
    ).update(
      {
        first_name: firstName,
        last_name: lastName,
        profile_picture: profilePicture
      },
      {
        where: { id: userId }
      }
    )

    if (updatedRowCount === 0) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      })
    }

    if (userId !== req.user.id) {
      await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
        admin_id: req.user.id,
        action_description: `User Details with id-${userId} Updated`
      })
    }

    res.status(200).send({
      success: true,
      message: 'User Update successfully',
      user: updatedRowCount
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
} // DELETE USER
exports.deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params

    const deletedRowCount = await User(
      db.sequelize,
      db.Sequelize.DataTypes
    ).destroy({
      where: { id: userId } // id is the primary key field
    })

    if (deletedRowCount === 0) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).send({
      success: true,
      message: 'User delete successfully'
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Internal server error'
    })
  }
}
exports.verifyTokenController = async (req, res) => {
  try {
    const verificationToken = req.params.verificationToken

    // Find the user by verification token
    const user = await User(db.sequelize, db.Sequelize.DataTypes).findOne({
      where: { verificationToken }
    })

    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'Email verification failed'
      })
    }
    user.isVerified = true
    await user.save()
    res.status(200).send({
      success: true,
      message: 'Email verified successfully'
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Internal server error'
    })
  }
}
