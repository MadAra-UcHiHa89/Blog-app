const Post = require("../../model/post/Post.model");
const expressAsyncHandler = require("express-async-handler");
const Filter = require("bad-words"); // package to filter out bad words
const { isValidMongoDbId } = require("../../utils/validateMongoDBId");
const User = require("../../model/user/User.model");
const { cloudinaryImageUpload } = require("../../utils/cloudinary");
const fs = require("fs");

//-----Create a new post (User must be logged in)-----//
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.user; // Since user is logged in, we can get the user id from the req.user object
    const isValidId = isValidMongoDbId(id);
    if (!isValidId) {
      throw new Error("Invalid user id");
    }

    // Before creating the post we'll check for bad words in it (if any)
    const filter = new Filter(); // Creating a new filter object (provided by the bad-words package)
    const foundProfanity1 = filter.isProfane(req.body.title); // isProfane method will return true if the text contains bad words (bad words are provided by the bad-words package)

    const foundProfanity2 = filter.isProfane(req.body.description);
    console.log(foundProfanity1);
    console.log(foundProfanity2);
    if (foundProfanity1 || foundProfanity2) {
      // => user's post contains bad words
      // Then we'll block the user
      const blockedUser = await User.findByIdAndUpdate(
        id,
        { isBlocked: true },
        { new: true }
      );
      return res.status(400).json({
        error: true,
        message: "Your post contains bad words. You have been blocked.",
        User: blockedUser
      });
    }
    // If the user doesn't contain bad words, then we'll create the post
    // Now  user has provided a file (image) then we'll upload it to cloudinary
    // console.log("req.file", req.file);
    // const localPath = `public/images/post/${req.file.filename}`; // path of file to upload to cloudinary
    // const uploadedImg = await cloudinaryImageUpload(localPath);

    // // We will delete the file from the local server once it is uploaded to cloudinary ie now
    // // We'll use the fs module to delete the file from the local server
    // fs.unlinkSync(localPath); // deletes the file from the local server

    //  We have to set id of user to post  document's author field ,
    // console.log(req.body);
    const newPost = await Post.create({
      title: req?.body?.title,
      // category: req?.body?.category,
      description: req?.body?.description,
      author: id
      // image: uploadedImg?.secure_url
    });
    res.status(200).json({
      message: "Post created successfully",
      post: newPost
    });
  } catch (err) {
    throw new Error(err);
  }
});

//---- Fetch ALL POSTS ----//
const fetchAllPostsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const allPosts = await Post.find({}).populate("author");
    res
      .status(200)
      .json({ message: "All posts fetched successfully", posts: allPosts });
  } catch (err) {
    throw new Error(err);
  }
});

//---- Fecth A Single post ----//

const fetchSinglePostCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const isIdValid = isValidMongoDbId(id);
    if (!isIdValid) {
      throw new Error("Invalid post id");
    }
    const fetechedPost = await Post.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 }
      },
      { new: true }
    )
      .populate("author")
      .populate("likes")
      .populate("dislikes"); // populate method will populate the author field of the post document with the user document
    // Now since this post has been fetched, we'll increment the number of views of the post

    res
      .status(200)
      .json({ message: "Post fetched successfully", post: fetechedPost });
  } catch (err) {
    throw new Error(err);
  }
});

// ---- Update a post ----// (User must be logged in && user can only update post which he created )

const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { id: userId } = req.user; // Since user must be logged in
    const isValidId = isValidMongoDbId(postId);

    if (!isValidId) {
      throw new Error("Invalid post id");
    }

    // Now checking if the user is authorized to update the post i.e. The user must be the author of the post
    const curPost = await Post.findById(postId).populate("author");

    // Now we'll compare the user id with the author id of the post to check if the user is the author of the post
    console.log(curPost.author._id, "curPost.author._id");
    console.log(userId, "userId");
    if (curPost.author._id != userId) {
      throw new Error("You are not authorized to update this post");
    }
    // Else if same then we'll update the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { ...req.body },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (err) {
    throw new Error(err);
  }
});

// ---- Delete a post ----// (User must be logged in && user can only delete post which he created )
// route: DELETE /api/posts/:id
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { id: userId } = req.user;
    const isValidId = isValidMongoDbId(postId);
    if (!isValidId) {
      throw new Error("Invalid post id");
    }
    // Now we'll check if the user is authorized to delete the post i.e. The user must be the author of the post
    const curPostToBeDeleted = await Post.findById(postId).populate("author");
    if (curPostToBeDeleted.author._id != userId) {
      throw new Error("You are not authorized to delete this post");
    }
    // Else if same then we'll delete the post
    const deletedPost = await Post.findByIdAndDelete(postId);
    res
      .status(200)
      .json({ message: "Post deleted successfully", post: deletedPost });
  } catch (err) {
    throw new Error(err);
  }
});

// --- Like a Post ---///
// User can add a like as well as toggle a like (if already liked then user can remove the like)
// route: PUT /api/posts/like/:id
const addToogleLikeToPostCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { id: userId } = req.user; // Since user must be logged in to like a post
    const isValidId = isValidMongoDbId(postId);
    if (!isValidId) {
      throw new Error("Invalid post id");
    }
    // First we'll fetch the post and check if the user has already liked the post or not
    const curPost = await Post.findById(postId);
    // Now we'll check if the user has already liked the post or not
    const hasLiked = curPost.likes.includes(userId);
    if (hasLiked) {
      // => curUser has already liked the post => we'll remove the like i.e user id from the likes array
      // So we'll use the $pull operator to remove the user id from the likes array
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: userId }
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Like Toggled successfully", post: updatedPost });
    }
    // Else if curUser hasnt liked then first we'll check if it belongs to the dislikes array or not
    const hasDisliked = curPost.dislikes.includes(userId);
    if (hasDisliked) {
      // => currrent User has disliked the post so we'll remove it from the dislikes array and add it to the likes array
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { dislikes: userId },
          $push: { likes: userId }
        },
        { new: true }
      );
      return res.status(200).json({
        message: "Liked post successfully (After removing Dislike)",
        post: updatedPost
      });
    }
    // => User hasnt disliked the post thus just add it to the likes array

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: userId }
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Liked post successfully", post: updatedPost });
  } catch (err) {
    throw new Error(err);
  }
});

const addToogleDislikeToPostCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { id: userId } = req.user;
    const isValidId = isValidMongoDbId(postId);
    if (!isValidId) {
      throw new Error("Invalid post id");
    }
    // first fectch the post
    const curPost = await Post.findByIdAndUpdate(postId);
    // Check if user has already disliked the post
    const hasDisliked = curPost.dislikes.includes(userId);
    if (hasDisliked) {
      // User has already disliked => toggle the dislike i.e remove the user id from the dislikes array
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { dislikes: userId }
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Dislike toggled successfully", post: updatedPost });
    }

    // => User hasnt dislked post , thus we'll check if he has liked the post or not
    const hasLiked = curPost.likes.includes(userId);
    if (hasLiked) {
      // => user has liked the post => remove from likes array and add to dislikes array
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: userId },
          $push: { dislikes: userId }
        },
        {
          new: true
        }
      );
      return res.status(200).json({
        message: "Disliked Post successfully (Removing the Like)",
        post: updatedPost
      });
    }

    // => User hasnt liked the post thus just add it to the dislikes array
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { dislikes: userId }
      },
      {
        new: true
      }
    );
    return res
      .status(200)
      .json({ message: "Disliked Post successfully", post: updatedPost });
  } catch (err) {}
});

module.exports = {
  createPostCtrl,
  fetchAllPostsCtrl,
  fetchSinglePostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  addToogleLikeToPostCtrl,
  addToogleDislikeToPostCtrl
};
