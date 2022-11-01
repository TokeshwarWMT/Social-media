const jwt = require('jsonwebtoken');

const useAuth = async (req, res, next) => {
    try {
        const token = req.headers['x-api-key'];
        if (!token) {
            return res.status(400).send('Please input token!!')
        };
        const key = 'webmob';
        const verifyUser = jwt.verify(token, key);
        req.user = verifyUser;
        next()
    } catch (e) {
        if (e.message === 'invalid token') {
            return res.status(498).send('invalid token!!')
        } else {
            return res.status(500).send(e)
        }
    }
};

module.exports = useAuth;