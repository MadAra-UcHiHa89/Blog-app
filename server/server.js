const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const app = express();
const dbConnect = require("./config/MongoDbConnect");
const PORT = process.env.PORT || 5000;

//--DB Connection--//
dbConnect();

//----- Middlewwares -----//
app.use(cors());
app.use(morgan("dev"));

//----End of Middlewares ----//

app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
