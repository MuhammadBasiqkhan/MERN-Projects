const express = require("express");
const {
  getAllproduct,
  CreateProduct,
  Updateproduct,
  Deleteproduct,
  getproductdetails,
  createReviewupdate,
  getallreviews,
  getdeletereview,
  getAllproductAdmin,
  CreateCategory,
  getAllCategory,
} = require("../controlers/productControler");
const { IsAuthenticateduser, authorizedrole } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllproduct);
router
  .route("/admin/product/new")
  .post(IsAuthenticateduser, authorizedrole("admin"), CreateProduct);

router.route("/admin/category/new").post(IsAuthenticateduser , authorizedrole("admin") , CreateCategory)
router.route("/category/all").get(getAllCategory)
router
  .route("/admin/product/:id")
  .put(IsAuthenticateduser, authorizedrole("admin"), Updateproduct)
  .delete(IsAuthenticateduser, authorizedrole("admin"), Deleteproduct);

router.route("/product/:id").get(getproductdetails);
router.route("/product/reviews").put(IsAuthenticateduser, createReviewupdate);
router.route("/reviews/get").get(getallreviews).delete(IsAuthenticateduser,getdeletereview);
router.route("/admin/products").get(IsAuthenticateduser , authorizedrole("admin") , getAllproductAdmin)



module.exports = router;
