const express = require('express')
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware.js')
const {
  updateUserController,
  getUserController,
  deleteUserController
} = require('../controllers/user/index.js')

const router = express.Router()

// User Profile
router.get('/get-user', getUserController)
router.put('/update-user/:user_id', updateUserController)
router.delete('/delete-user/:user_id', deleteUserController)

// Protected route for the user
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true })
})

// Protected route for the admin
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true })
})

module.exports = router
