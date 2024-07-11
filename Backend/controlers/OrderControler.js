const OrderModel = require("../models/OrderM");
const productModel = require("../models/productM");
const  UserModel = require("../models/userM")
const ErrorHandler = require("../utils/errorhandler");
const AsyncError = require("../middleware/Catchasyncerrors");
const mongoose = require("mongoose");

//Create a Order
const OrderCreated = AsyncError(async (req, res, next) => {
  const {
    ShipingInfo,
    OrderItem,
    paymentinfo,
    ItemsPrice,
    TaxPrice,
    ShipingPrice,
    TotalPrice,
  } = req.body;


  const Order = await OrderModel.create({
    ShipingInfo,
    OrderItem,
    paymentinfo,
    ItemsPrice,
    TaxPrice,
    ShipingPrice,
    TotalPrice,
    paidAt:Date.now(),
    user:req.user.id
  })


  const User = await UserModel.findByIdAndUpdate(req.user.id, {
            $push: { OrdersID: [Order._id] },
          });

  
    
    
    res.status(200).json({
      success: true,
      message: "Order created",
      Order
    });
 
});

//get Single Order
const getSingleOrder = AsyncError(async (req , res , next) => {
    const order = await OrderModel.findById(req.params.id).populate("user" , "name email")
    

    if(!order){
        return next(new ErrorHandler("Order not Found", 404));
    }

    res.status(200).json({
        success:true,
        order
    })
})


//get Loggedin User Orders
const getMyOrder = AsyncError(async (req , res , next) => {
    const orders = await OrderModel.find({user:req.user.id})

    res.status(200).json({
        success:true,
        orders
    })
})


//get All Orders for Admin
const getAllOrder = AsyncError(async (req , res , next) => {
    const orders = await OrderModel.find()
    let totalAmount = 0

    orders.forEach(element => {
        totalAmount += element.TotalPrice
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})

// //get Update Order Status for Admin
const UpdateOrderStatus = AsyncError(async (req , res , next) => {
    const order = await OrderModel.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order not Found", 404));
    }
    if(order.orderStatus === "Delivered"){
       return next(new ErrorHandler("You already delivered order" , 404))
    }

    if(req.body.status==="Shipped"){
        order.OrderItem.forEach(async (element) => {
            await updateStock(element.product, element.quantity);
        });
    }

       order.orderStatus = req.body.status
       if(req.body.status ==="Delivered"){
         await UserModel.findByIdAndUpdate(order.user, { $set: { IsOrdered: true } });
        order.dilverdAt = Date.now()
       }
       await order.save({validateBeforeSave:false})

    res.status(200).json({
        success:true,
    })
})

async function updateStock(id , quantity){ 
    const product = await productModel.findById(id)
    product.stock =  product.stock - quantity
    await product.save({validateBeforeSave:false})

 }



//get Delete Order for Admin
 const getDeleteOrder = AsyncError(async (req , res , next) => {
    const order = await OrderModel.findByIdAndDelete(req.params.id)
    if(!order){
        return next(new ErrorHandler("Order not Found", 404));
    }
    res.status(200).json({
        success:true,
        message:"Order deleted",
        order
    })
})


module.exports = {
  OrderCreated,
  getSingleOrder,
  getMyOrder,
  getAllOrder,
  UpdateOrderStatus,
  getDeleteOrder
};
