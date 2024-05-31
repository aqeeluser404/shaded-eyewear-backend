const UserService = require('../services/userService')

// USER AUTHENTICATION CONTROLLERS
module.exports.UserRegisterController = async (req, res) => {
    try {
        await UserService.UserRegisterService(req.body);
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send(error.message);
    }
}
module.exports.UserLoginController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const token = await UserService.UserLoginService(username, email, password);
        res.header('auth-token', token).send(token);
    } catch (error) {
        res.status(400).send(error.message);
    }
}