const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , "Please Enter Product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true , "Please Enter Description"]
    },
    price:{
        type:Number,
        required:[true , "Please Enter Product Price Rate"],
        maxlength:[8 , "Price should be conside 8 Number"]
    },
    ratings:{
        type:Number,
        default:0

    },
    Images:[{
        public_id:{
            type:String ,
            required:true
        },
        url:{
            type:String ,
            required:true 
        }
        
    }],
    category:{
        type:String,
        required:[true , "Please Enter the Product Category"]
    },

    stock:{
        type:Number,
        required:[true , "Please Enter Stock of the Product"],
        maxlength:[4 , "Stock cannot be excced of 4 charaters"],
        default:1
    },
    NumberOfreviews:{
        type:Number,
        default:0
    },
    reviews:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
            required:true 
        },
        rating:{
            type:Number,
            required:true 
        },
        comment:{
            type:String,
            required:true  
        }
    }],

   
    createdAt:{
        type:Date,
        default:Date.now
    }

})


module.exports = mongoose.model("Product" , productSchema)