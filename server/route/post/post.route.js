const express = require("express");
const router = express.Router();
const {
  authorizationMiddleware,
} = require("../../middlewares/auth/authMiddleware");
const {
  photoUpload,
  postPhotoResize,
} = require("../../middlewares/upload/photoUpload");
const {
  createPostCtrl,
  getAllPostsCtrl,
} = require("../../controllers/post/posts.controller");

// Relative route is: /api/posts

//Create new Post
// (User must be authenticated && authorized) i.e logged in user can create a post
router.post(
  "/",
  authorizationMiddleware,
  photoUpload.single("image"),
  postPhotoResize,
  createPostCtrl
);

// Get all posts
router.get("/", authorizationMiddleware, getAllPostsCtrl);

module.exports = router;
