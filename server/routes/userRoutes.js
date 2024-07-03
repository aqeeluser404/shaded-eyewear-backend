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
    router.post('/admin/user/create', verifyToken, requireAdmin, UserController.CreateUserController)
    router.get('/admin/user/all', verifyToken, requireAdmin, UserController.FindAllUsersController)
    router.get('/admin/user/logged-in', verifyToken, requireAdmin, UserController.FindUsersLoggedInController)
    router.get('/admin/user/frequent-users', verifyToken, requireAdmin, UserController.FindUsersFrequentlyLoggedInController)
/*
    ================================================================= admin & user routes
*/
    router.post('/user/logout/:id', verifyToken, UserController.UserLogoutController)
    router.get('/user/view', verifyToken, UserController.FindUserByTokenController)
    router.get('/user/view/:id', verifyToken, UserController.FindUserByIdController)
    router.put('/user/update/:id', verifyToken, UserController.UpdateUserController)
    router.delete('/user/delete/:id', verifyToken, UserController.DeleteUserController)
/*
    ================================================================= public routes
*/
    router.post('/auth/login', verifyTokenOptional, UserController.UserLoginController)
    router.post('/auth/register', UserController.UserRegisterController)

    module.exports = router;






    // router.use('/admin/user', verifyToken, requireAdmin);
    // const routes = [
    //     { method: 'post', path: '/create', controller: UserController.CreateUserController },
    //     { method: 'get', path: '/all', controller: UserController.FindAllUsersController },
    //     { method: 'get', path: '/logged-in', controller: UserController.FindUsersLoggedInController },
    //     { method: 'get', path: '/frequent-users', controller: UserController.FindUsersFrequentlyLoggedInController }
    // ];
    // routes.forEach(route => {
    //     router[route.method](`/admin/user${route.path}`, route.controller);
    // });