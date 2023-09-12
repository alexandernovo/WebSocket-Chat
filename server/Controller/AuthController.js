const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

class AuthController {
    auth = asyncHandler(async (req, res) => {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ status: 'invalid', message: 'Token not provided' });
        }

        try {
            const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
            return res.status(200).json({ status: 'valid', message: 'Authenticated', user: decoded });
        } catch (error) {
            return res.status(401).json({ status: 'invalid', message: 'Token is not valid' });
        }
    });
}

module.exports = AuthController;
