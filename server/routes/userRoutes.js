const express = require('express')
const router = express.Router();
const UserController = require('../src/controllers/userController')
const { verifyToken, requireAdmin } = require('../middleware/authentication');

// Admin routes
router.post('/admin/user/create', verifyToken, requireAdmin, UserController.CreateUserController);
router.get('/admin/user/all', verifyToken, requireAdmin, UserController.FindAllUsersController);

// user & admin routes
router.get('/user/view', verifyToken, UserController.FindUserByTokenController);    // read from token
router.get('/user/view/:id', verifyToken, UserController.FindUserByIdController);   // read from id
router.put('/user/update/:id', verifyToken, UserController.UpdateUserController);
router.delete('/user/delete/:id', verifyToken, UserController.DeleteUserController);

// public routes
router.post('/user/register', UserController.UserRegisterController)
router.post('/user/login', UserController.UserLoginController);

module.exports = router;
