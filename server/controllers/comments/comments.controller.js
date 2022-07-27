const Comment = require("../../model/comment/Comment.model");
const expressAsyncHandler = require("express-async-handler");
const { isValidMongoDbId } = require("../../utils/validateMongoDBId");

// Create a Comment for a Post (User must be logged in )
// /api/comments/ (postId in req.body)
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: postId } = req.body;
    const { id: userId } = req.user; // Since user is logged in, we can get the userId from the req.user

    const isValidId = isValidMongoDbId(postId);
    if (!isValidId) {
      throw new Error("Invalid Post Id");
    }
    // Now we can create a comment for the post,

    const createdComment = await Comment.create({
      post: postId,
      user: userId,
      description: req.body.description,
    });
    res.status(201).json({
      message: "Comment created successfully",
      comment: createdComment,
    });
  } catch (err) {
    throw new Error(err);
  }
});

// ---- Get All comments belonging to a post ----//
// Endpoint is: GET /api/comments/ (postId in req.body)

const fetchAllCommentsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: postId } = req.body;
    const isValidId = isValidMongoDbId(postId);
    if (!isValidId) {
      throw new Error("Invalid Post Id");
    }
    const allComments = await Comment.find({ post: postId })
      .populate("user")
      .sort({
        createdAt: "descending",
      });
    res.status(200).json({
      message: "All comments fetched successfully",
      comments: allComments,
    });
  } catch (err) {
    throw new Error(err);
  }
});

// --- Fetch A single comment belonging to a post  ---//
// Endpoint : GET /api/comments/:commentId

const fetchSingleCommentCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const isValidId = isValidMongoDbId(commentId);
    if (!isValidId) {
      throw new Error("Invalid Mongo Id");
    }
    // Just fectch the comment with the commentId and populate the user
    const comment = await Comment.findById(commentId);
    res
      .status(200)
      .json({ message: "Comment fetched successfully", comment })
      .populate("user");
  } catch (err) {
    throw new Error(err);
  }
});

// --- Update a comment  ---//
// -- Only the user who created the comment can update the comment --//
// Endpoint : PUT /api/comments/:commentId
const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const { id: userId } = req.user; // Since user is logged in, we can get the userId from the req.user
    const isValidId = isValidMongoDbId(commentId);
    if (!isValidId) {
      throw new Error("Invalid Mongo Id");
    }
    // Only user who created the comment can update the comment
    // So we'll fectch the comment and only if the userId matches with the userId of the comment, then we'll update the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      // Comment not found
      throw new Error("Comment not found");
    }
    if (comment.user != userId) {
      // Logged in user is not the user who created the comment
      throw new Error("You are not authorized to update this comment");
    }
    // Logged in user is the user who created the comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { description: req.body.description },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (err) {
    throw new Error(err);
  }
});

// ---Delete a Comment ---//
// -- Only the user who created the comment can delete the comment --//
// Endpoint : DELETE /api/comments/:commentId

const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const { id: userId } = req.user; // Since user is logged in, we can get the userId from the req.user
    const isValidId = isValidMongoDbId(commentId);
    if (!isValidId) {
      throw new Error("Invalid Mongo Id");
    }
    // Only user who created the comment can delete the comment , so fetching the comment and comparing the userId
    const comment = await Comment.findById(commentId);

    if (!comment) {
      // Comment not found
      throw new Error("Comment not found hence cannot be deleted");
    }

    if (comment.user != userId) {
      // Logged in user is not the user who created the comment
      throw new Error("You are not authorized to delete this comment");
    }
    // Logged in user is the user who created the comment, so can delete the comment
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      message: "Comment deleted successfully",
      comment: deletedComment,
    });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchSingleCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
};
