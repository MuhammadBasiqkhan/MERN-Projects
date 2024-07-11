const mongoose = require("mongoose");

const connectDatabase = async () => { 
  try {
    await mongoose.connect(process.env.DB_Connection);
    console.log("MongoDB connected on this server:", mongoose.connection.host);
  } catch (error) {  //unhandled promise rejection
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit the process on failure
  }
};

module.exports = connectDatabase;
