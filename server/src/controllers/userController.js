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
// USER SERVICES
module.exports.FindUserByIdController = async (req, res) => {
    const { id } = req.params
    try {
        const user = await UserService.FindUserByIdService(id)
        res.json(user)
    }
    catch (error) {
        res.status(404).send(error.message);
    }
}
module.exports.FindUserByTokenController = async (req, res) => {
    try {
      // get the token from the Authorization header
      const token = req.headers.authorization.split(' ')[1];
  
      const user = await UserService.getUserFromTokenService(token);
      res.json(user);
    } 
    catch (error) {
      res.status(500).json({ message: error.message });
    }
}
// ADMIN USER CONTROLLERS
module.exports.CreateUserController = async (req, res) => {
    try {
        await UserService.CreateUserService(req.body);
        res.status(201).send('User created by admin');
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
}
module.exports.FindAllUsersController = async (req, res) => {
    try {
        const users = await UserService.FindAllUsersService();
        res.status(200).json(users);
    } 
    catch (error) {
        res.status(404).send(error.message);
    }
}
module.exports.UpdateUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const userDetails = req.body;

        await UserService.UpdateUserService(id, userDetails);
        res.status(200).send('User updated by admin');
    } 
    catch (error) {
        res.status(404).send(error.message);
    }
}
module.exports.DeleteUserController = async (req, res) => {
    try {
        await UserService.DeleteUserService(req.params.id);
        res.status(200).send('User deleted by admin');
    } 
    catch (error) {
        res.status(404).send(error.message);
    }
}