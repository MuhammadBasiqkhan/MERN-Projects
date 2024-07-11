const app = require("./app")
const dotenv = require("dotenv")
const connectDB = require("./config/databaseconfig")
const cloudinary = require("cloudinary")

// Handling uncaught Error
process.on("uncaughtException" , (err) => { 
    console.log(`Server is shutdown due to this Error`)
    console.log(`The Error is ${err.message}`)

    process.exit(1);
 })

//config
dotenv.config({path:"backend/config/config.env"})

// connecting to database
connectDB()

// Cloudinary Set up
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen(process.env.PORT , () => { 
    console.log(`Server is running http://localhost:${process.env.PORT}/`)
 }) 


