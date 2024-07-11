const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  ShipingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    ZipCode: { type: Number, required: true },
    Phoneno: { type: Number, required: true },
  },

  OrderItem: [
    {
      name: { type: String, required: true },
      price: { type: String, required: true },
      quantity: { type: String, required: true },
      image: { type: String, required: true },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  paymentinfo: {
    id: { type: String, required: true },
    status: { type: String, required: true },
  },

  paidAt: {
    type: Date,
    default: Date.now,
  },

  ItemsPrice:{
    type:Number,
    default:0,
    required:true
  },
  TaxPrice:{
    type:Number,
    default:0,
    required:true
  },
  ShipingPrice:{
    type:Number,
    default:0,
    required:true
  },
  TotalPrice:{
    type:Number,
    default:0,
    required:true
  },

  orderStatus:{
    type:String ,
    required :true,
    default:"Processing"
  },
  dilverdAt:Date,
  createdAt:{
    type:Date,
    default:Date.now
  }


});

module.exports = mongoose.model("Order", OrderSchema);
