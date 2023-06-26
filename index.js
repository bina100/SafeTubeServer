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


// // dotenv.config()

// // const connect = () =>{
// //     mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.tsntcbq.mongodb.net/safeTube`).then(()=>{
// //     //  mongoose.connect(`${config.mongo}`).then(()=>{
// //         console.log("Connected to DB")
// //     }).catch(err=>{
// //         throw err
// //     })
// // }



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