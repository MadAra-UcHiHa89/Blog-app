const express = require("express");
const router = express.Router();
const {
  registerUserCtrl,
  loginUserCtrl,
  getAllUsersCtrl,
  deleteUserCtrl,
  getSingleUserCtrl,
} = require("../../controllers/users/users.controller");

// Get All Users
router.get("/", getAllUsersCtrl);

// Login User
router.post("/login", loginUserCtrl);

// Register User
router.post("/register", registerUserCtrl);

// Delete a User
router.delete("/:id", deleteUserCtrl);

// Get Single User
router.get("/:id", getSingleUserCtrl);

module.exports = router;
