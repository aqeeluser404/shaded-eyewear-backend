const express = require('express')
const router = express.Router();
const UserController = require('../src/controllers/userController')
const { verifyToken, requireAdmin } = require('../middleware/authentication');

// admin routes
router.post('/admin/user/create', verifyToken, requireAdmin, UserController.CreateUserController);
router.get('/admin/user/all', verifyToken, requireAdmin, UserController.FindAllUsersController);
router.get('/admin/user/logged-in', verifyToken, requireAdmin, UserController.FindUsersLoggedInController)
router.get('/admin/user/frequent-users', verifyToken, requireAdmin, UserController.FindUsersLoggedInController)
// router.post('/user/forgot-password', UserController.UserForgotPasswordController);

// user routes
router.post('/user/logout/:id', verifyToken, UserController.UserLogoutController)

// user & admin routes
router.get('/user/view', verifyToken, UserController.FindUserByTokenController);    // read from token
router.get('/user/view/:id', verifyToken, UserController.FindUserByIdController);   // read from id
router.put('/user/update/:id', verifyToken, UserController.UpdateUserController);
router.delete('/user/delete/:id', verifyToken, UserController.DeleteUserController);

// public routes
router.post('/user/register', UserController.UserRegisterController)
router.post('/user/login', UserController.UserLoginController)

module.exports = router;
