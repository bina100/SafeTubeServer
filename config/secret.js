require("dotenv").config()

exports.config = {
    mongo: process.env.MONGO,
    userDb: process.env.USER_DB,
    passDb: process.env.PASS_DB,
    tokenSecret: process.env.TOKEN_SECRET,
    fierbaseKey: process.env.FIREBASE_KEY,
}