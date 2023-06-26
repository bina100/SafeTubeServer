const express = require("express");
const { signup, signin, googleAuth } = require("../controllers/auth.js");
const router = require("./users.js");

// const router = express.Router()

//create user
router.post("/signup", signup)

//sign in
router.post("/signin", signin)

//google auth
router.post("/google", googleAuth)


module.exports = router