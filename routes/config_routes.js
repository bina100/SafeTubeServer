// const indexR = require("./index")
const userRoutes =require("./users.js")
const authRouters =require("./auth.js")
const videoRoutes =require("./videos.js")


exports.routInit = (app) => {
    // app.use("/", indexR)
    app.use("/api/users", userRoutes)
    app.use("/api/auth", authRouters)
    app.use("/api/videos", videoRoutes)
}