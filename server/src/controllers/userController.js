const UserService = require('../services/userService')

module.exports.UserRegisterController = async (req, res) => {
    try {
        await UserService.UserRegisterService(req.body)
        res.status(201).json({ message: 'User registered' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
// module.exports.UserLoginController = async (req, res) => {
//     try {
//         const { username, email, password } = req.body
//         const token = await UserService.UserLoginService(username, email, password)

//         const user = await UserService.FindUserByTokenService(token)                                                        // Update login status
//         await user.updateLoginStatus(token)

//         const isProduction = process.env.NODE_ENV === 'production'
//         // const maxAge = 1 * 60 * 1000                                                                                     // 1 minute in milliseconds   
//         const maxAge = 24 * 60 * 60 * 1000;                                                                                 // 1 day in milliseconds  
//         res.cookie('token', token, { httpOnly: false, secure: isProduction, sameSite: 'strict', maxAge: maxAge })           // creating cookie 
//         res.send('Login successful')

//     } catch (error) {
//         res.status(400).send(error.message)
//     }
// }

const isProduction = process.env.NODE_ENV === 'production';
const maxAge = 24 * 60 * 60 * 1000;  // 1 day

module.exports.UserLoginController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const token = await UserService.UserLoginService(username, email, password);

        const user = await UserService.FindUserByTokenService(token);
        if (user.loginInfo.isLoggedIn && user.loginInfo.loginToken !== token) {
            user.loginInfo.isLoggedIn = false;
            user.loginInfo.loginToken = null;
            await user.save();
            res.clearCookie('token', { httpOnly: true, secure: isProduction, sameSite: 'Lax', path: '/' });
        }

        await user.updateLoginStatus(token);

        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'Lax',
            maxAge: maxAge,
            path: '/'
        });
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(400).send(error.message);
    }
};


module.exports.UserLogoutController = async (req, res) => {
    const { id } = req.params
    try {
        await UserService.UserLogoutService(id)

        const isProduction = process.env.NODE_ENV === 'production'                                                          // clearing the cookie 
        // Clear the cookie with the same settings used to set it
        res.clearCookie('token', { httpOnly: true, secure: isProduction, sameSite: 'lax', path: '/' });
        res.json({ message: 'User logged out successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
module.exports.FindUsersLoggedInController = async (req, res) => {
    try {
        const users = await UserService.FindUsersLoggedInService()
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
module.exports.FindUsersFrequentlyLoggedInController = async (req, res) => {
    try {
        const users = await UserService.FindUsersFrequentlyLoggedInService()
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
module.exports.FindUserByIdController = async (req, res) => {
    const { id } = req.params
    try {
        const user = await UserService.FindUserByIdService(id)
        res.json(user)
    }
    catch (error) {
        res.status(404).json({ error: error.message })
    }
}
module.exports.FindUserByTokenController = async (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: 'Access Denied' })
        }
        const user = await UserService.FindUserByTokenService(token)
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
module.exports.CreateUserController = async (req, res) => {
    try {
        await UserService.CreateUserService(req.body);
        res.status(201).json({ message: 'User created successfully' })
    } 
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}
module.exports.FindAllUsersController = async (req, res) => {
    try {
        const users = await UserService.FindAllUsersService()
        res.status(200).json(users)
    } 
    catch (error) {
        res.status(404).json({ error: error.message })
    }
}
module.exports.UpdateUserController = async (req, res) => {
    try {
        const { id } = req.params
        const userDetails = req.body

        await UserService.UpdateUserService(id, userDetails)
        res.status(200).json({ message: 'User updated successfully' })
    } 
    catch (error) {
        res.status(404).json({ error: error.message })
    }
}
module.exports.DeleteUserController = async (req, res) => {
    try {
        await UserService.DeleteUserService(req.params.id)
        res.status(200).json({ message: 'User deleted successfully' })
    } 
    catch (error) {
        res.status(404).json({ error: error.message })
    }
}