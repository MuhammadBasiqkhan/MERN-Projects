const express = require("express");
const {
  OrderCreated,
  getSingleOrder,
  getMyOrder,
  getAllOrder,
  UpdateOrderStatus,
  getDeleteOrder,
} = require("../controlers/OrderControler");

const router = express.Router();
const { IsAuthenticateduser, authorizedrole } = require("../middleware/auth");

router.route("/Order/new").post(IsAuthenticateduser, OrderCreated);
router.route("/Order/:id").get(IsAuthenticateduser, getSingleOrder);
router.route("/Orders/myorder").get(IsAuthenticateduser, getMyOrder);
router
  .route("/admin/Orders/all")
  .get(IsAuthenticateduser, authorizedrole("admin"), getAllOrder);
router
  .route("/admin/Order/:id")
  .put(IsAuthenticateduser, authorizedrole("admin"), UpdateOrderStatus)
  .delete(IsAuthenticateduser, authorizedrole("admin"), getDeleteOrder);



module.exports = router;
