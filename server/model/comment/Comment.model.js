const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    // post to which the comment belongs to
    post: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Post",
      required: [, "Comment must belong to a post,Post is required"],
    },
    // user who has commented
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "Comment must belong to a user,User is required"],
    },
    // comment description / text of the comment
    description: {
      type: String,
      required: [true, "Comment description is required"],
    },
  },
  {
    timestamp: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Compiling the schema into a model
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
