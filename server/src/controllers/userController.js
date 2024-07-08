/*
    dependencies
*/
    const UserService = require('../services/userService')
/*
    ================================================================= // CONTROLLERS
*/
    module.exports.UserRegisterController = async (req, res) => {
        try {
            await UserService.UserRegisterService(req.body);
            res.status(201).json({ message: 'User registered' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    module.exports.UserLoginController = async (req, res) => {
        const { username, email, password } = req.body;
        try {
            const token = await UserService.UserLoginService(username, email, password);
            res.header('auth-token', token).send(token);    // change from json to ensure token works
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    module.exports.UserLogoutController = async (req, res) => {
        const { id } = req.params
        try {
            const user = await UserService.UserLogoutService(id)
            res.json({ message: 'User logged out successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    module.exports.FindUsersLoggedInController = async (req, res) => {
        try {
            const users = await UserService.FindUsersLoggedInService();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    module.exports.FindUsersFrequentlyLoggedInController = async (req, res) => {
        try {
            const users = await UserService.FindUsersFrequentlyLoggedInService();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    module.exports.FindUserByIdController = async (req, res) => {
        const { id } = req.params
        try {
            const user = await UserService.FindUserByIdService(id)
            res.json(user)
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    module.exports.FindUserByTokenController = async (req, res) => {
        try {
            if (req.headers['auth-token']) {
                const token = req.headers['auth-token'];
                // const token = req.headers.authorization.split(' ')[1];
                const user = await UserService.FindUserByTokenService(token);
                res.json(user);
            }
            else {
                res.status(400).json({ error: 'Authorization header is missing' });
            }
        } 
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    module.exports.CreateUserController = async (req, res) => {
        try {
            await UserService.CreateUserService(req.body);
            res.status(201).json({ message: 'User created successfully' });
        } 
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    module.exports.FindAllUsersController = async (req, res) => {
        try {
            const users = await UserService.FindAllUsersService();
            res.status(200).json(users);
        } 
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    module.exports.UpdateUserController = async (req, res) => {
        try {
            const { id } = req.params;
            const userDetails = req.body;

            await UserService.UpdateUserService(id, userDetails);
            res.status(200).json({ message: 'User updated successfully' });
        } 
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    module.exports.DeleteUserController = async (req, res) => {
        try {
            await UserService.DeleteUserService(req.params.id);
            res.status(200).json({ message: 'User deleted successfully' });
        } 
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

// module.exports.UserForgotPasswordController = async (req, res) => {
//     try {
//         const email = req.body.email;
//         const message = await UserService.UserForgotPasswordService(req, email);
//         res.status(200).json({ message: message });
//     } catch (error) {
//         res.status(500).json({ error: error.toString() });
//     }
// }