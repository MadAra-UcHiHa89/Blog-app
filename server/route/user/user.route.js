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
  followUserCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unblockUserCtrl,
  generateVerificationTokenCtrl,
  verifyAccountCtrl,
  forgotPasswordTokenCtrl,
  forgotPasswordCtrl,
  profilePhotoUploadCtrl,
} = require("../../controllers/users/users.controller");

const {
  authorizationMiddleware,
} = require("../../middlewares/auth/authMiddleware");
const {
  photoUpload,
  profilePhotoResize,
} = require("../../middlewares/upload/photoUpload");

// Login User
router.post("/login", loginUserCtrl);

// Get All Users
router.get("/", authorizationMiddleware, getAllUsersCtrl);

// Register User
router.post("/register", registerUserCtrl);

// generate-verify-token
router.post(
  "/generate-verify-token",
  authorizationMiddleware,
  generateVerificationTokenCtrl
);

// Verify Account (for now its get but later will be put since we are updating the user)
router.get(
  "/verify-account/:token",
  authorizationMiddleware,
  verifyAccountCtrl
);

// Generate token for forgot password (No authorization middleware required since user has forgot password and cannot login)
router.post("/forgot-password-token", forgotPasswordTokenCtrl);

// Forgot passwrord (reset password) (Same as above no authorization middleware required) put method since we are updating the user
router.put("/forgot-password", forgotPasswordCtrl);

// Delete a User
router.delete("/:id", authorizationMiddleware, deleteUserCtrl);

// Follow a User
router.put("/follow", authorizationMiddleware, followUserCtrl);

// Unfollow a user
router.put("/unfollow", authorizationMiddleware, unfollowUserCtrl);

// block User
router.put("/block/:id", authorizationMiddleware, blockUserCtrl);

// Upload profile picture (put method since we are updating the user)
router.put(
  "/profilephoto-upload",
  authorizationMiddleware,
  photoUpload.single("image"), // image -> value of name attribute of form's input field
  profilePhotoResize, // Middleware that resizes the image
  profilePhotoUploadCtrl
);

// Unblock User (Her we'll have admin only middleware to unblock a user)
router.put("/unblock/:id", authorizationMiddleware, unblockUserCtrl);

// Update User // Authorization since only the user itself can update his / her profile
router.put("/:id", authorizationMiddleware, updateProfileCtrl);

// Get Single User // Any user can access this router without being logged in since no password returned
router.get("/:id", getSingleUserCtrl);

// Get User Profile // Only authorised user i.e itself can access this route since password returned
router.get("/profile/:id", authorizationMiddleware, getUserProfileCtrl);

// Update the password of the user // Only authorised user i.e itself can access this route
router.put("/password/:id", authorizationMiddleware, updatePasswordCtrl);

module.exports = router;
