const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET
const User = require('../src/models/userModel');
const axios = require('axios')

async function checkTokens() {
    const users = await User.find({ 'loginInfo.isLoggedIn': true })
    for (const user of users) {
        const token = user.loginInfo.loginToken                                                              // Access the token from the user model
        if (token) {                                                                                         // check if the token is still valid
            try {
                jwt.verify(token, jwtSecret);
                console.log(`Token for user ${user._id} is valid.`)
            } catch (err) {
                if (err.name === 'TokenExpiredError') {                                                     // Handle token expiration
                    user.loginInfo.isLoggedIn = false
                    user.loginInfo.loginToken = null                                                        // Clear the token
                    await user.save();
                    console.log(`User ${user._id} logged out due to expired token`);

                    try {                                                                                   // Call the logout controller to clear the cookie
                        await axios.post(`${process.env.BACKEND_HOST_LINK}/user/logout/${user._id}`)
                    } catch (error) {
                        console.error(`Failed to log out user ${user._id}:`, error)
                    }
                }
            }
        }
    }
}
function verifyToken(req, res, next) {
    const token = req.cookies.token
    if (!token) 
        return res.status(401).send('Access Denied')
    try {
        const verified = jwt.verify(token, jwtSecret)
        req.user = verified
        next()
    } catch {
        res.status(400).send('Invalid Token')
    }
}
function requireAdmin(req, res, next) {
    if (req.user.userType !== 'admin') return res.status(403).send('Admin access required')
    next();
}

module.exports = { verifyToken, requireAdmin, checkTokens }




















// Middleware for verifying JWT - users and admins
// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers['authorization'];   'Authorization': `Bearer ${token}`
//     if (!bearerHeader) return res.status(401).send('Access Denied');

//     const bearerToken = bearerHeader.split(' ')[1];
//     if (!bearerToken) return res.status(401).send('Bearer token not provided');

//     try {
//         const verified = jwt.verify(bearerToken, jwtSecret);
//         req.user = verified;
//         next();
//     } catch {
//         res.status(400).send('Invalid Token');
//     }
// }