const mongoose = require("mongoose");
const mongoURL = process.env.MONGO_URL;

// Method-1

// mongoose.connect(mongoURL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connection.on("connected", () => {
//   console.log("MongoDB is connected");
// });

// mongoose.connection.on("error", () => {
//   console.log("MongoDB connection error");
// });

// Method-2
const dbConnect = async () => {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB is connected");
  } catch (err) {
    console.log("MongoDB connection error");
  }
};

module.exports = dbConnect;
