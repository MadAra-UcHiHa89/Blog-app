const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const app = express();
const dbConnect = require("./config/db/MongoDbConnect");
const PORT = process.env.PORT || 5000;
const userRouter = require("./route/user/user.route");
const {
  errorHandler,
  pageNotFound,
} = require("./middlewares/error/errorHandler");
//--DB Connection--//
dbConnect();

//----- Middlewwares -----//
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//----End of Middlewares ----//

//-- Routes --//
app.use("/api/users", userRouter);

// -- End of Routes --//

// --Page not found error --// // If no route is found, we'll send a 404 error
app.use(pageNotFound);
// -- Error Handler --//
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
