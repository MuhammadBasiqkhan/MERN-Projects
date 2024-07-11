const express = require("express")
const app = express()
const middlewareerror = require("./middleware/error")
const cookieparser = require("cookie-parser")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const path = require("path")


// // Config
// if (process.env.NODE_ENV !== "PRODUCTION") {
//     require("dotenv").config({ path: "backend/config/config.env" });
//   }

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieparser());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));


//product routes import  
const product = require("./routes/productroute")

//User  routes import 
const User = require("./routes/Userroute")

//Order routes import
const Order = require("./routes/Orderroute")

//Payment routes import
const Payment = require("./routes/paymentroute")

//Post routes import
const QNA = require("./routes/QandAroute")



app.use("/api/v1" , product)
app.use("/api/v1" , User)
app.use("/api/v1" , Order)
app.use("/api/v1" , Payment)
app.use("/api/v1" , QNA)


// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

// middle ware of error 
app.use(middlewareerror)


module.exports = app