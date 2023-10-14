const User = require('../../models/user')
const db = require('../../models/index')
const Adminlog = require('../../models/adminAuditLog')
const { hashPassword } = require('../../helpers/authHelper')

exports.addUser = async (req, res) => {
  const { email, password, firstName, lastName, profilePicture, role } =
    req.body
  const hashedPassword = await hashPassword(password)
  const newUser = await User(db.sequelize, db.Sequelize.DataTypes).create({
    email,
    password: hashedPassword,
    first_name: firstName,
    last_name: lastName,
    profile_picture: profilePicture,
    role
  })
  if (newUser) {
    await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
      admin_id: req.user.id,
      action_description: 'New user with Added'
    })
    return res.status(201).json({ msg: 'User Added', newUser })
  } else {
    throw new Error('Adding order Failed')
  }
}

exports.viewAllUsers = async (req, res) => {
  const allUsers = await User(db.sequelize, db.Sequelize.DataTypes).findAll({
    attributes: { exclude: ['password'] }
  })
  if (allUsers) {
    await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
      admin_id: req.user.id,
      action_description: 'Users List Fetched'
    })
    res.status(200).json({
      msg: 'All Users fetched',
      allUsers
    })
  } else {
    throw new Error('No user found')
  }
}

exports.updateUser = async (req, res) => {
  const userId = req.params.id
  const { id, email, password, firstName, lastName, profilePicture, role } =
    req.body
  const hashedPassword = await hashPassword(password)
  const updateUser = await User(db.sequelize, db.Sequelize.DataTypes).update(
    {
      id,
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      profile_picture: profilePicture,
      role
    },
    { where: { id: userId } }
  )
  if (updateUser[0] === 1) {
    await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
      admin_id: req.user.id,
      action_description: `User Details with id-${userId} Updated`
    })
    res
      .status(200)
      .json({ msg: 'User info Updated', updateUser: 1 })
  } else {
    throw new Error('User Updation failed')
  }
}

exports.deleteUser = async (req, res) => {
  const userId = req.params.id
  const deletedUser = await User(db.sequelize, db.Sequelize.DataTypes).destroy({
    where: { id: userId }
  })
  if (deletedUser === 1) {
    await Adminlog(db.sequelize, db.Sequelize.DataTypes).create({
      admin_id: req.user.id,
      action_description: `User with id-${userId} Deleted`
    })
    res.status(200).json({ msg: 'User Deleted', deletedUser })
  } else {
    throw new Error('Deletion Failed')
  }
}
