const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const { createError } = require("../error.js")
const jwt = require("jsonwebtoken")
const { UserModel, validUser, validLogin } = require("../models/User.js")
const { config } = require("../config/secret")
const { LocalStorage } = require('node-localstorage');

// localhost:8800/api/auth/signup
const signup = async (req, res, next) => {
    let validBody = validUser(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try {
        var salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new UserModel({ ...req.body, password: hash })

        await newUser.save();
        res.status(200).send("User has been created!")
    } catch (err) {
        next(err)
        // next(createError(404, "not found sorry!"))
    }
}

// localhost:8800/api/auth/signin
const signin = async (req, res, next) => {
    let validBody = validLogin(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try {
        const user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return next(createError(404, "User not found!"))
        }
        const isCorrent = await bcrypt.compare(req.body.password, user.password)
        if (!isCorrent) {
            return next(createError(400, "Wrong credentials!"))
        }
       
        let newToken = jwt.sign({ _id: user.id, role:user.role }, `${config.tokenSecret}`, { expiresIn: "60mins" })
        res.status(200).json({user:user._doc, token:newToken})

    } catch (err) {
        next(err)
        // next(createError(404, "not found sorry!"))
    }
}

const googleAuth = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })
        if (user) {
            let newToken = jwt.sign({ _id: user.id }, `${config.tokenSecret}`, { expiresIn: "60mins" })
            res.header("x-api-key", newToken).status(200).json(user._doc)

        } else {
            const newUser = new UserModel({
                ...req.body,
                fromGoogle: true
            })
            const savedUser = await newUser.save()
            let newToken = jwt.sign({ _id: savedUser.id }, `${config.tokenSecret}`, { expiresIn: "60mins" })

            res.header("x-api-key", newToken).status(200).json(savedUser._doc)
        }
    } catch (err) {
        next(err)
    }
}

module.exports = { signin, signup, googleAuth }
