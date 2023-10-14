const express = require('express')
const {
  viewAllUsers,
  deleteUser
} = require('../controllers/user/adminUserController')
const asyncRouteHandler = require('../util/asyncRouteHandler')
const router = express.Router()
const upload = require('../multerConfig.js')
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware.js')
const {
  updateUserController,
  getUserController,
  deleteUserController,
  registerController
} = require('../controllers/user/index.js')

router.get('/', asyncRouteHandler(viewAllUsers))

router.post('/add-user', upload.single('profilePicture'), asyncRouteHandler(registerController))

router.patch('/edit-user/:id', upload.single('profilePicture'), asyncRouteHandler(updateUserController))

router.delete('/delete-user/:id', asyncRouteHandler(deleteUser))

// User Profile
router.get('/get-user', requireSignIn, asyncRouteHandler(getUserController))
router.put('/update-user/:userId', requireSignIn, asyncRouteHandler(updateUserController))
router.delete('/delete-user/:userId', requireSignIn, asyncRouteHandler(deleteUserController))

// Protected route for the user
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true })
})

// Protected route for the admin
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true })
})

module.exports = router
