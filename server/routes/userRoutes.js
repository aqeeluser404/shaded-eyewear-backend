/*
    dependencies
*/
    const express = require('express');
    const router = express.Router();
    const UserController = require('../src/controllers/userController');
    const { verifyToken, requireAdmin } = require('../middleware/authentication');
/*
    ================================================================= admin routes
*/
    router.use('/admin/user', verifyToken, requireAdmin);
    const routes = [
        { method: 'post', path: '/create', controller: UserController.CreateUserController },
        { method: 'get', path: '/all', controller: UserController.FindAllUsersController },
        { method: 'get', path: '/logged-in', controller: UserController.FindUsersLoggedInController },
        { method: 'get', path: '/frequent-users', controller: UserController.FindUsersFrequentlyLoggedInController }
    ];
    routes.forEach(route => {
        router[route.method](`/admin/user${route.path}`, route.controller);
    });
/*
    ================================================================= admin & user routes
*/
    router.use('/user', verifyToken);
    const userRoutes = [
        { method: 'post', path: '/logout/:id', controller: UserController.UserLogoutController },
        { method: 'get', path: '/view', controller: UserController.FindUserByTokenController },
        { method: 'get', path: '/view/:id', controller: UserController.FindUserByIdController },
        { method: 'put', path: '/update/:id', controller: UserController.UpdateUserController },
        { method: 'delete', path: '/delete/:id', controller: UserController.DeleteUserController }
    ];
    userRoutes.forEach(route => {
        router[route.method](`/user${route.path}`, route.controller);
    });
/*
    ================================================================= public routes
*/
    const authRoutes = [
        { method: 'post', path: '/login', controller: UserController.UserLoginController },
        { method: 'post', path: '/register', controller: UserController.UserRegisterController }
    ];
    authRoutes.forEach(route => {
        router[route.method](`/auth${route.path}`, route.controller);
    });

    module.exports = router;