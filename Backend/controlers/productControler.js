const productModel = require("../models/productM");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorhandler");
const cloudinary = require("cloudinary");
const AsyncError = require("../middleware/Catchasyncerrors");
const ApiFeatures = require("../utils/apiFeatures");
const OrderModel = require("../models/OrderM")
const UserModel = require("../models/userM")
const CategoryModel = require("../models/categoryM")



const CreateProduct = AsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.Images === "string") {
    images.push(req.body.Images);
  
  }  else {
    images = req.body.Images;
    
  }
  const imagesLinks = [];
 
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

 

  req.body.Images = imagesLinks;
  req.body.user = req.user.id;

  const product = await productModel.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});



const Updateproduct = AsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }
  // Images Start Here
  let images = [];

  if (typeof req.body.Images === "string") {
    images.push(req.body.Images);
  } else {
    images = req.body.Images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.Images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.Images[i].public_id);
    }
  
    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.Images = imagesLinks;
  }


  const updatedProduct = await productModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true, useFindAndModify: false }
  );

  res.status(200).json({ success: true, product: updatedProduct });
});

const Deleteproduct = AsyncError(async (req, res, next) => {
  const product = await productModel.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404)); // Pass error to middleware
  }
  for (let i = 0; i < product.Images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.Images[i].public_id);
  }


  res.status(200).json({ success: true, message: "Product deleted" });
});




const getAllproduct = AsyncError(async (req, res, next) => {
  const resultperpage = 7;

  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter();
    
  let products = await apiFeatures.query.clone();
  
  // Get the filtered products count directly from the database
  const filteredProductsCount = await productModel.countDocuments(apiFeatures.query._conditions);

  apiFeatures.pagination(resultperpage);
  products = await apiFeatures.query;

  const productcount = await productModel.countDocuments(); // Total count of products in the database

  res.status(200).json({ 
    success: true, 
    products, 
    productcount, 
    resultperpage, 
    filteredProductsCount 
  });
});
;




//get product details --admin
const getAllproductAdmin = AsyncError(async (req, res, next) => {

  const products = await productModel.find()

  res
    .status(200)
    .json({ success: true, products});
});

const getproductdetails = AsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  
  // console.log(req.user._id)
 
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404)); 
  }

const orders = await OrderModel.find({
  "OrderItem.product": { $in: [product._id] },
});

//  console.log(orders);

  res.status(200).json({ success: true, product }); 
});

// create new Review and update the review
const createReviewupdate = AsyncError(async (req, res, next) => {
  const { rating, comment, productid } = req.body;


  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: parseInt(rating),
    comment: comment,
  };

  const product = await productModel.findById(productid);

  if (!product) {
    throw new Error("Product not found.");
  }

  const isReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.NumberOfreviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((element) => {
    avg += element.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.json({ success: true, message: "Review updated successfully!" });
});

// get all reviews of a product
const getallreviews = AsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// get delete reviews of a product
const getdeletereview = AsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.query.productid);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  if (!reviews) {
    return res
      .status(404)
      .json({ success: false, message: "Product review not found" });
  }

  let avg = 0;

  reviews.forEach((element) => {
    avg += element.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const Numberofreviews = reviews.length;

  await productModel.findByIdAndUpdate(
    req.query.productid,
    {
      reviews,
      ratings,
      Numberofreviews,
    },
    {
      new: true,
      runValidators: false,
      useFindAndModify: false,
    }
  );

  res.status(200).json({ success: true, message: "Review deleted" });
});


const CreateCategory = AsyncError(async (req , res , next) => { 

  const Category = await CategoryModel.create({
    CateName:req.body.Category
  })

  

  res.status(201).json({
    success: true,
    Category,
  });

})

const getAllCategory = AsyncError(async (req , res , next) => { 

  const categories = await CategoryModel.find()

  res.status(201).json({
    success: true,
    categories,
  });

})



module.exports = {
  getAllproduct,
  CreateProduct,
  Updateproduct,
  Deleteproduct,
  getproductdetails,
  createReviewupdate,
  createReviewupdate,
  getallreviews,
  getdeletereview,
  getAllproductAdmin,
  CreateCategory,
  getAllCategory
};
