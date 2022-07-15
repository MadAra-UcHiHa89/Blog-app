const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
require("dotenv").config();
const User = require("../../model/user/User.model");

const authorizationMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;
  console.log(req.headers);
  try {
    if (
      req?.headers?.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      //   console.log(req.headers.authorization);
      //   console.log(token);
      if (token) {
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedToken);
        if (decodedToken) {
          const user = await User.findById(decodedToken.id).select("-password"); // -password will not return the password
          req.user = user;
          next();
        } else {
          throw new Error("Invalid Token");
        }
      } else {
        throw new Error("Invalid Token");
      }
    } else {
      throw new Error("No token provided");
    }
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { authorizationMiddleware };
