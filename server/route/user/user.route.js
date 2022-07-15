const express = require("express");
const router = express.Router();
const {
  registerUserCtrl,
  loginUserCtrl,
  getAllUsersCtrl,
  deleteUserCtrl,
  getSingleUserCtrl,
  getUserProfileCtrl,
  updateProfileCtrl,
  updatePasswordCtrl,
} = require("../../controllers/users/users.controller");

const {
  authorizationMiddleware,
} = require("../../middlewares/auth/authMiddleware");

// Get All Users
router.get("/", authorizationMiddleware, getAllUsersCtrl);

// Login User
router.post("/login", loginUserCtrl);

// Register User
router.post("/register", registerUserCtrl);

// Delete a User
router.delete("/:id", deleteUserCtrl);

// Update User // Authorization since only the user itself can update his / her profile
router.put("/:id", authorizationMiddleware, updateProfileCtrl);

// Get Single User // Any user can access this router without being logged in since no password returned
router.get("/:id", getSingleUserCtrl);

// Get User Profile // Only authorised user i.e itself can access this route since password returned
router.get("/profile/:id", authorizationMiddleware, getUserProfileCtrl);

router.put("/password/:id", authorizationMiddleware, updatePasswordCtrl);

module.exports = router;
