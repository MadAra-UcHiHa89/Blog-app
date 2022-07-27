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
  updatePostCtrl,
  deletePostCtrl,
  addToogleLikeToPostCtrl,
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

// ---- Update a post ----// (User must be logged in && user can only update post which he created )
router.put("/:id", authorizationMiddleware, updatePostCtrl);

// ---- Delete a post ----// (User must be logged in && user can only delete post which he created )
router.delete("/:id", authorizationMiddleware, deletePostCtrl);

// --- Like /Toggle like a Post ---//
router.put("/like/:id", authorizationMiddleware, addToogleLikeToPostCtrl);

module.exports = router;
