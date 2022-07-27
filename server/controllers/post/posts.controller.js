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
        message: "Your post contains bad words. You have been blocked.",
        User: blockedUser,
      });
    }
    // If the user doesn't contain bad words, then we'll create the post
    // Now  user has provided a file (image) then we'll upload it to cloudinary
    console.log("req.file", req.file);
    const localPath = `public/images/post/${req.file.filename}`; // path of file to upload to cloudinary
    const uploadedImg = await cloudinaryImageUpload(localPath);

    // We will delete the file from the local server once it is uploaded to cloudinary ie now
    // We'll use the fs module to delete the file from the local server
    fs.unlinkSync(localPath); // deletes the file from the local server

    //  We have to set id of user to post  document's author field ,
    const newPost = await Post.create({
      title: req?.body?.title,
      category: req?.body?.category,
      description: req?.body?.description,
      author: id,
      image: uploadedImg?.secure_url,
    });
    res.status(200).json({
      message: "Post created successfully",
      post: newPost,
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
        $inc: { numViews: 1 },
      },
      { new: true }
    ).populate("author"); // populate method will populate the author field of the post document with the user document
    // Now since this post has been fetched, we'll increment the number of views of the post

    res
      .status(200)
      .json({ message: "Post fetched successfully", post: fetechedPost });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { createPostCtrl, fetchAllPostsCtrl, fetchSinglePostCtrl };
