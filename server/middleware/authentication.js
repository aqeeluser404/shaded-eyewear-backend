const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

// Middleware for verifying JWT - users and admins
function verifyToken(req, res, next) {
    const token = req.header('auth-token'); // 'auth-token': token
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, jwtSecret);
        req.user = verified;
        next();
    } catch {
        res.status(400).send('Invalid Token');
    }
}

// Middleware for admin requirements
function requireAdmin(req, res, next) {
    if (req.user.userType !== 'admin') return res.status(403).send('Admin access required');
    next();
}

module.exports = { verifyToken, requireAdmin };




















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