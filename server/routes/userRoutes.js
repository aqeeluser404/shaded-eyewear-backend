const express = require('express')
const router = express.Router();
const UserController = require('../src/controllers/userController')
const { verifyToken, requireAdmin, requireUser } = require('../middleware/authentication');

// Admin routes
// router.post('/admin/user/create', verifyToken, requireAdmin, UserController.AdminCreateUserController);
// router.get('/admin/user/all', verifyToken, requireAdmin, UserController.AdminViewUsersController);
// router.put('/admin/user/update/:id', verifyToken, requireAdmin, UserController.AdminUpdateUserController);
// router.delete('/admin/user/delete/:id', verifyToken, requireAdmin, UserController.AdminDeleteUserController);

// user authentication routes
router.post('/user/register', UserController.UserRegisterController)
router.post('/user/login', UserController.UserLoginController);

// token
// router.get('/user/view', verifyToken, requireUser, UserController.UserDetailsFromTokenController);
// user
// router.get('/user/view/:id', verifyToken, requireUser, UserController.UserDetailsFromIdController);

module.exports = router;
