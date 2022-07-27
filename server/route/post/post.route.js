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
  fetchAllPostsCtrl,
  fetchSinglePostCtrl,
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
router.get("/", authorizationMiddleware, fetchAllPostsCtrl);

// Get A single post // route is: /api/posts/:id
router.get("/:id", authorizationMiddleware, fetchSinglePostCtrl);

module.exports = router;
