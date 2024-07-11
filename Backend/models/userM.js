const mongoose = require('mongoose');
const validator = require("validator")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
    maxlength: [40, "Name Cannot excede on 40 charcters"],
    minlength: [4, "Name should have more then 4 characters"]
  },
  email: {
    type: String,
    required: [true, "Please Enter Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a Valid Email"]
  },
  ContactNumber: {
    type: String,
    default: "03",
  },
  password: {
    type: String,
    required: [true, "Please Enter a password"],
    minlength: [8, "Password should have more then 8 characters"],
    select: false
  },
  avator: {
    public_id:{
      type: String,
      required: true
    },
    url:{
      type: String,
      required: true
    }
  },
  role: {
    type: String,
    default: "user"
  },

  createdAt:{
    type:Date,
    default:Date.now(),
  },
  resetpasswordtoken: String,
  resetpasswordExpire: Date,

  IsOrdered:{
    type:Boolean,
    default:false
  },

  OrdersID: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],

},);


//create JWT token
userSchema.methods.getJwtToken = function () { 
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Generating reset password token
userSchema.methods.getResetPasswordtoken = function(){ 
  const resettoken = crypto.randomBytes(20).toString("hex");

  this.resetpasswordtoken = crypto.createHash("sha256").update(resettoken).digest("hex");

  this.resetpasswordExpire = Date.now() + 15 * 60 * 1000; 

  return resettoken;
}




module.exports = mongoose.model('User', userSchema);
