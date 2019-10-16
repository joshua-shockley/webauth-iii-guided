// const bcrypt = require('bcryptjs');
// const Users = require('../users/users-model.js');

const jwt = require('jsonwebtoken');
const secret = require('../config/secrets.js');
module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, secret.jwtSecret, (err, decodedToken) => {
            if (err) {
                //foulplay
                res.status(401).json({ message: 'no way' })
            } else {
                //token good
                req.user = {
                    username: decodedToken.username,
                    role: decodedToken.role
                }
                next();
            }
        })
    } else {
        res.status(400).json({ message: 'no token provided' });

    }
};