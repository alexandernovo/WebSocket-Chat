const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
        return decoded;
    } catch (error) {
        return null;
    }
};

module.exports = verifyToken;