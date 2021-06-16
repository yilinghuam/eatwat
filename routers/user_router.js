const express = require('express')
const router = express.Router()
const userController = require('../controllers/user_controller')
const {authenticatedOnly,guestOnly} = require('../middlewares/auth-middleware')

router.get('/login', guestOnly, userController.login)
router.get('/signup', guestOnly, userController.signup)
router.post('/signup', guestOnly, userController.create)
router.post('/login', guestOnly, userController.loginUser)
router.get('/logout', authenticatedOnly, userController.logout)
router.get('/forgetpassword',guestOnly,userController.forgetpassword)
router.post('/forgetpassword',guestOnly,userController.sendResetEmail)
router.get('/forgetpassword/:id',guestOnly,userController.resetpassword)
router.patch('/forgetpassword/:id',guestOnly,userController.updateUserPassword)


module.exports = router