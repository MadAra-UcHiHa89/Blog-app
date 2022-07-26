const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Post title is required"],
    trim: true, // no spaces in the beginning and end of the string
  },
  category: {
    type: String,
    required: [true, "Post Category is required"],
    // enum:[""], // Category can be only be one of the following values
    default: "All",
  },
  // Storing the id of the users who have liked the post ,[Array of user ids]
  likes: {
    type: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
  },
  // Storing the id of the users who have disliked the post ,[Array of user ids]
  dislikes: {
    type: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
  },
  // To ensure the same user cannot like the same post twice
  isLiked: {
    type: Boolean,
    default: false, // i.e the user has not liked the post yet
  },
  // Same for dislikes
  isDisliked: {
    type: Boolean,
    default: false,
  },
  numViews: {
    type: Number,
    default: 0,
  },
  // Each post can have only one author , so we'll store the id of the author in the post
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "Post Author is required"],
  },

  // Description / body of the post
  description: {
    type: String,
    required: [true, "Post description is required"],
  },
  // Image of the post , we'll store the url of the image uploaded to cloudinary here
  image: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2022/07/20/14/45/shipwreck-7334280_1280.jpg",
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
