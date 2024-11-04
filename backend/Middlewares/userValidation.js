const JWT_SECRET = require('../config');
const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decode = jwt.verify(token, JWT_SECRET);
        req.userId = decode.userId;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Unauthorized, jwt token is wrong or expired" });
    }
};

module.exports = ensureAuthenticated;
    