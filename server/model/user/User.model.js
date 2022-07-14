const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"], // To send custom error message if the required field is not filled
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  profilePhoto: {
    type: String, // To store the image url
    default:
      "https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png", // if user doesn't upload any image then we'll use a default profile image
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  bio: {
    type: String,
  },
  postCount: {
    type: Number, // Number of posts created by the user
    default: 0,
  },
});
