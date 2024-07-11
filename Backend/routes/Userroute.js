const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forwardPassword,
  resetPassword,
  getUserdetails,
  UpdatedPassword,
  UpdatedUserProfile,
  getAllusers,
  getSingleusersDetials,
  UpdatedUserRole,
  DeleteUser,
} = require("../controlers/userControler");

const router = express.Router();
const { IsAuthenticateduser, authorizedrole } = require("../middleware/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgotpassword").post(forwardPassword);
router.route("/password/resetpassword/:token").put(resetPassword);
router.route("/me").get(IsAuthenticateduser, getUserdetails);
router
  .route("/password/updatepassword")
  .put(IsAuthenticateduser, UpdatedPassword);
router
  .route("/update/updateUserprofile")
  .put(IsAuthenticateduser, UpdatedUserProfile);
router
  .route("/admin/users")
  .get(IsAuthenticateduser, authorizedrole("admin"), getAllusers);
router
  .route("/admin/user/:id")
  .get(IsAuthenticateduser, authorizedrole("admin"), getSingleusersDetials)
  .put(IsAuthenticateduser, authorizedrole("admin"), UpdatedUserRole)
  .delete(IsAuthenticateduser, authorizedrole("admin"), DeleteUser)

module.exports = router;
