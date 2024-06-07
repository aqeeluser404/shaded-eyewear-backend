const express = require('express')
const router = express.Router();
const UserController = require('../src/controllers/userController')
const { verifyToken, requireAdmin, requireUser } = require('../middleware/authentication');

// Admin routes
router.post('/admin/user/create', verifyToken, requireAdmin, UserController.CreateUserController);
router.get('/admin/user/all', verifyToken, requireAdmin, UserController.FindAllUsersController);
router.put('/admin/user/update/:id', verifyToken, requireAdmin, UserController.UpdateUserController);
router.delete('/admin/user/delete/:id', verifyToken, requireAdmin, UserController.DeleteUserController);

// public routes
router.post('/user/register', UserController.UserRegisterController)
router.post('/user/login', UserController.UserLoginController);

// read from token
router.get('/user/view', verifyToken, UserController.UserDetailsFromTokenController);
// read from id
router.get('/user/view/:id', verifyToken, UserController.UserDetailsFromIdController);

module.exports = router;
