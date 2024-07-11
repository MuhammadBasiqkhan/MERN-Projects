const express = require("express");
const {
    processPayment,
    
  } = require("../controlers/paymentControler");

  const router = express.Router();
const { IsAuthenticateduser } = require("../middleware/auth");



router.route("/payment/process").post(IsAuthenticateduser, processPayment);


module.exports = router;