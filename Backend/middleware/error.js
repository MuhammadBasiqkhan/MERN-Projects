const ErrorHandler = require("../utils/errorhandler"); 

module.exports = (err, req, res, next) => {
 

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //wrong mongodb ID error
  if(err.name === "CastError"){
    const message = "Resource not Found "+err.path
    err = new ErrorHandler(message , 404)
  }

  //mongoose duplicate key error 
  if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
    err = new ErrorHandler(message , 404)
  }

  //Wrong JWT error 
  if(err.name === "jsonWebTokenError"){
    const message = `JWT token is invalid , try again later`
    err = new ErrorHandler(message , 404)
  }

  //Wrong JWT Expire error 
  if(err.name === "TokenExpiredError"){
    const message = `JWT token is Expired , try again later`
    err = new ErrorHandler(message , 404)
  }

  res.status(err.statusCode).json({
    success: false,
    message:  err.message  
  });
};
