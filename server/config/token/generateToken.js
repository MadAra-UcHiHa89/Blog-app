const jwt = require("jsonwebtoken");
require("dotenv").config();

// --Function to generate token--//
const generateToken = (userId) => {
  // Userid is id of the user who is logged in , and will be the payload of the token (i.e the data stored in the token)
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// jwt.sign(payload, secretOrPrivateKey, options])

module.exports = { generateToken };
