const express = require("express");
const router = express.Router();
const {
  registerUserCtrl,
  loginUserCtrl,
} = require("../../controllers/users/users.controller");

// Get All Users
router.get("/", (req, res) => {
  res.send("Get All Users");
});

router.post("/login", loginUserCtrl);

router.post("/register", registerUserCtrl);

module.exports = router;
