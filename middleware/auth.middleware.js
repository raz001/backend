const jwt = require("jsonwebtoken");
const { BlacklistedTokenModel } = require('../model/blacklist.model')
const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, 'masai');
            console.log(decoded)
            if (decoded) {
                req.body.userID = decoded.userID;
                req.body.user = decoded.user;

                const tokenExists = await BlacklistedTokenModel.exists({ token });
                if (!tokenExists) {
                    next();
                } else {
                    res.json({ msg: "Token is blacklisted. Please log in again." });
                }

            }
            else res.json({ msg: "not authorized" })
        } catch (error) {
            res.json({ error: error })
        }
    } else {
        res.json({ msg: "token not found!" })
    }
};

module.exports = { auth }