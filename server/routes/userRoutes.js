const express = require('express');
const router = express.Router();
const UserController = require('../src/controllers/userController');
const { verifyToken, requireAdmin } = require('../middleware/authentication');

router.post('/user/logout/:id', verifyToken, UserController.UserLogoutController)
router.get('/user/view', verifyToken, UserController.FindUserByTokenController)
router.get('/user/view/:id', verifyToken, UserController.FindUserByIdController)
router.put('/user/update/:id', verifyToken, UserController.UpdateUserController)
router.delete('/user/delete/:id', verifyToken, UserController.DeleteUserController)

// authentication
router.post('/auth/login', UserController.UserLoginController)
router.post('/auth/register', UserController.UserRegisterController)

// admin routes
router.post('/admin/user/create', verifyToken, requireAdmin, UserController.CreateUserController)
router.get('/admin/user/all', verifyToken, requireAdmin, UserController.FindAllUsersController)
router.get('/admin/user/logged-in', verifyToken, requireAdmin, UserController.FindUsersLoggedInController)
router.get('/admin/user/frequent-users', verifyToken, requireAdmin, UserController.FindUsersFrequentlyLoggedInController)

module.exports = router