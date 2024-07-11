const ErrorHandler = require("../utils/errorhandler");
const AsyncError = require("../middleware/Catchasyncerrors");
const Usermodel = require("../models/userM");
const bcrypt = require("bcrypt");
const sendTokken = require("../utils/sendjwttoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// register user
const registerUser = AsyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "images",
    width: 150,
    crop: "scale",
  });

  const { name, email, password ,phoneNumber } = req.body;

  if(password.length >= 8){
    const hashpassword = await bcrypt.hash(password, 10);
    
    
      const User = await Usermodel.create({
        name,
        email,
        ContactNumber:phoneNumber,
        password: hashpassword,
        avator: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });
      sendTokken(User, 201, res);
    
  }
 else{
    return next(new ErrorHandler("Password is more then 8 Characters"))
  }

  
});

// login user
const loginUser = AsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email and Password", 400));
  }

  const user = await Usermodel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Email and Password and is Invalid", 401));
  }

  const passmath = await bcrypt.compare(password, user.password);
  if (!passmath) {
    return next(new ErrorHandler("Email and Password and is Invalid", 401));
  }

   

  sendTokken(user, 200, res);
});

// logout user
const logoutUser = AsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  
  res.status(200).json({
    success: true,
    message: "Logout Succesfully",
  });
});

//forward paswwrd link and seding email
const forwardPassword = AsyncError(async (req, res, next) => {
  const User = await Usermodel.findOne({
    email: req.body.email,
  });

  if (!User) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  const resettoken = User.getResetPasswordtoken();

  await User.save({ validateBeforeSave: false });

  const resetpasswordurl = `${process.env.FRONTEND_URL}/password/resetpassword/${resettoken}`;
  const message = `Your Password reset token is :- \n ${resetpasswordurl} \n if you have not requested this email then please ignore it`;

  try {
    await sendEmail({
      email: User.email,
      subject: "Meet Fashion Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email send to ${User.email} Sucessfully`,
    });
  } catch (error) {
    User.resetpasswordtoken = undefined;
    User.resetpasswordExpire = undefined;

    await User.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
const resetPassword = AsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await Usermodel.findOne({
    resetpasswordtoken: resetPasswordToken,
    resetpasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Token invalid or expired", 400));
  }

  // Validate password match
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  
  const hashpassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashpassword;
  user.resetpasswordtoken = undefined;
  user.resetpasswordExpire = undefined;
  await user.save();

  sendTokken(user, 200, res);
});


//get User details 
const getUserdetails = AsyncError(async (req , res , next) => { 

  const user = await Usermodel.findOne({_id:req.user.id})

  res.status(200).json({
    success:true,
    user
  })
 })


 // Update User Password
 const UpdatedPassword = AsyncError(async (req , res , next ) => { 
  const user = await Usermodel.findOne({_id:req.user.id}).select("+password")
  
  const passmath = await bcrypt.compare(req.body.oldpassword, user.password);
  
  if(!passmath){
    return next(new ErrorHandler("Password and is Invalid", 401));
  }
  if (req.body.newpassword !== req.body.confirmpassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }
  const hashpassword = await bcrypt.hash(req.body.newpassword, 10);

  user.password = hashpassword
  await user.save()
  
  sendTokken(user, 200, res);

})

 // Update User Profile 
const UpdatedUserProfile = AsyncError(async (req , res , next ) => { 
  
  const Userdata = {
    name : req.body.name,
    email: req.body.email,
    ContactNumber:req.body.phoneNumber
  }


  if (req.body.avatar) {
    const existingUser = await Usermodel.findById(req.user.id);
    if (existingUser.avator && existingUser.avator.public_id) {
      await cloudinary.uploader.destroy(existingUser.avator.public_id);
    }

    const avatarData = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "images",
      width: 150,
      crop: "scale"
    });

    Userdata.avator = {
      public_id: avatarData.public_id,
      url: avatarData.secure_url
    };
  }


  const user = await Usermodel.findByIdAndUpdate(req.user.id , Userdata ,{
    new:true,
    runValidators:false,
    useFindAndModify:false
  })
  
  
  res.status(200).json({
    success:true
  })

})


// get all users for admin 
const getAllusers = AsyncError(async (req , res , next ) => {
  const users = await Usermodel.find()

  res.status(200).json({
    success:true,
    users
  })

 })

 //get Single user details admin
const getSingleusersDetials = AsyncError(async (req , res , next ) => {

  const user = await Usermodel.findOne({_id:req.params.id})

  if(!user){
    return next(new ErrorHandler(`User Not Found on this ID: ${req.params.id}`, 404));
  }
  res.status(200).json({
    success:true,
    user
  })

})

// Update User role admin
const UpdatedUserRole = AsyncError(async (req , res , next ) => { 
  
  const Userdata = {
    name : req.body.name,
    email: req.body.email,
    role:req.body.role
  }


  const user = await Usermodel.findByIdAndUpdate(req.params.id , Userdata ,{
    new:true,
    runValidators:false,
    useFindAndModify:false
  })
  
  
  res.status(200).json({
    success:true
  })

})

// Delete User  admin
const DeleteUser = AsyncError(async (req , res , next ) => { 
  
  const deletedUser = await Usermodel.findByIdAndDelete(req.params.id)
  const imageId = deletedUser.avator.public_id;

  await cloudinary.v2.uploader.destroy(imageId);
  res.status(200).json({
    success:true,
    message:"User deleted Sucessfully"
  })

})






module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forwardPassword,
  resetPassword,
  getUserdetails,
  UpdatedPassword,
  UpdatedUserProfile,
  UpdatedUserProfile,
  getAllusers,
  getSingleusersDetials,
  UpdatedUserRole,
  DeleteUser,
};
