const ErrorHandler = require("../utils/errorhandler");
const asyncHandler = require("./Catchasyncerrors");
const Usermodel = require("../models/userM");
const jwt = require("jsonwebtoken");

const IsAuthenticateduser = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login to acces this resourse", 401));
  }

  const decodedata = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await Usermodel.findById(decodedata.id);
  next();
});

const authorizedrole = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role ${req.user.role} is not allowed to access this resources`,
          403
        )
      );
    }
    next();
  };
};

module.exports = {
  IsAuthenticateduser,
  authorizedrole,
};
