
const express = require("express");
const { UserModel } = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { BlacklistedTokenModel } = require("../model/blacklist.model");
const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(200).json({ msg: "User already exist, please login" })
        }
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.status(400).json({ error: err })
            } else {
                const user = new UserModel({ ...req.body, password: hash });
                await user.save();
                res.status(200).json({ msg: "User is registered" })
            }

        })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, async (err, result) => {
                if (result) {
                    let token = jwt.sign({ userID: user._id, user: user.name }, "masai", { expiresIn: "7 days" })
                    res.status(200).json({ msg: "login successful", token })
                } else {
                    res.status(200).json({ msg: "wrong credentials" })
                }
            })
        } else {
            res.status(200).json({ msg: "user not found" })
        }
    } catch (error) {
   res.status(400).json({error})
    }

})

userRouter.post('/logout', async (req, res) => {
    const { token } = req.headers.authorization?.split(' ')[1];
  
    try {
      const blacklistedToken = new BlacklistedTokenModel({ token });
      await blacklistedToken.save();
  
      res.status(200).json({ msg: "Logout successful" });
    } catch (error) {
      res.status(400).json({ error });
    }
  });
  
module.exports = { userRouter }