const express = require("express");
const router = express.Router();
const {
  authorizationMiddleware,
} = require("../../middlewares/auth/authMiddleware");

const {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchSingleCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
} = require("../../controllers/comments/comments.controller");

//-- Create a Comment for a Post (User must be logged in ) --//
// Endpoint is: /api/comments/ (postId in req.body)
router.post("/", authorizationMiddleware, createCommentCtrl);

// --- Fetch All comments belonging to a post ---//
// Endpoint is: GET /api/comments/
router.get("/", authorizationMiddleware, fetchAllCommentsCtrl);

// ---Fetch A single comment belonging to a post ---//
router.get("/:id", authorizationMiddleware, fetchSingleCommentCtrl);

// ---Update a comment ---//
// -- Only the user who created the comment can update the comment --//
router.put("/:id", authorizationMiddleware, updateCommentCtrl);

// ---Delete a comment ---//
// -- Only the user who created the comment can delete the comment --//
router.delete("/:id", authorizationMiddleware, deleteCommentCtrl);

module.exports = router;
