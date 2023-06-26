const jwt = require("jsonwebtoken");
const { createError } = require("./error.js");
const { config } = require("./config/secret.js");

 const verifyToken = (req, res, next) => {
    const token=req.header("x-api-key")
    if (!token) {
        return next(createError(401, "You are not authentication!"))
    }
    try{
        let decodeToken=  jwt.verify(token, `${config.tokenSecret}`)
        req.tokenData = decodeToken
        next()
    }catch(err){
        return next(createError(403, "Token is not valid!"))
    }
}


const verifyAdmin = (req,res,next) => {
    let token = req.header("x-api-key");
    if(!token){
        return next(createError(401, "You are not authentication!"))
    }
    try{
      let decodeToken = jwt.verify(token,config.tokenSecret);
      if(decodeToken.role != "safeTubeAdmin"){
        return res.status(401).json({msg:"Token invalid or expired, code: 3"})
      }
      req.tokenData = decodeToken;
      next();
    }
    catch(err){
      console.log(err);
      return res.status(401).json({msg:"Token invalid or expired, log in again or you hacker!"})
    }
  }
module.exports = {verifyToken, verifyAdmin}