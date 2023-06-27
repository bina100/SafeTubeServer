const express = require("express")
const path = require("path");
const http = require("http")
const cors =require("cors");

const {routInit} = require("./routes/config_routes")
require("./db/mongoConnect")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
routInit(app)

app.use((err, req, res,next)=>{
    const status =err.status || 500;
    const message =err.message || "Somthing went wrang!";
   
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

const server =http.createServer(app)
let port = process.env.PORT || 8800;
server.listen(port)