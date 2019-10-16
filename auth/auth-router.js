const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //added library to use token
const Users = require('../users/users-model.js');
const secrets = require('../config/secrets.js'); //brings in the secret from another location to use below
// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
    user.password = hash;

    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                //create token needs to be before the res
                const token = generateToken(user);
                res.status(200).json({
                    message: `Welcome ${user.username}!`,
                    token,
                });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

function generateToken(user) {
    const payload = {
        subject: user.id, //subproperty in the head of token
        username: user.username,
        role: user.role, //
        //...other data
    };
    // const secret = 'lkadoimaoioevoqirjtoaisejt';//dont need this if we import one in and use below
    options = {
        expiresIn: '8h',
    };

    return jwt.sign(payload, secrets.jwtSecret, options) //jwtSecret coming from another file.. the secret is imported now
}

module.exports = router;