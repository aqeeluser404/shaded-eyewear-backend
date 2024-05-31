const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

// Middleware for verifying JWT
// 'Authorization': `Bearer ${token}`
// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers['authorization'];
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

// Middleware for verifying JWT
// 'auth-token': token
function verifyToken(req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, jwtSecret);
        req.user = verified;
        next();
    } catch {
        res.status(400).send('Invalid Token');
    }
}

// Middleware for checking user type
function requireAdmin(req, res, next) {
    if (req.user.userType !== 'admin') return res.status(403).send('Admin access required');
    next();
}
// Middleware for checking user type
function requireUser(req, res, next) {
    if (req.user.userType !== 'user') return res.status(403).send('User access required');
    next();
}

module.exports = { verifyToken, requireAdmin, requireUser };