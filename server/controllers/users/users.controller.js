const User = require("../../model/user/User.model");
const bcrypt = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const { generateToken } = require("../..//config/token/generateToken");
const { isValidMongoDbId } = require("../../utils/validateMongoDBId");

// ---Register User ---//
const registerUserCtrl = expressAsyncHandler(async (req, res) => {
  // 1. Check if the user already exists

  const existingUser = await User.findOne({ email: req?.body?.email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  try {
    // Since hashing isnt part of the controller and is part of the model we have tp hash the password before we save it to the database

    const user = await User.create({
      ...req.body,
      firstName: req?.body?.firstName, // shorthand for => req.body && req.body.firstName
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// ---Login User ---//
const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ email: req?.body?.email });
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await user.comparePassword(req?.body?.password);
    console.log(isMatch);
    if (!isMatch) {
      throw new Error("Invalid Credentials");
    }
    // Once the user is found and the password is matched, we'll generate a token
    const token = generateToken(user._id);
    res.status(200).json({
      message: "Welcome! ",
      _id: user?._id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      profilePhoto: user?.profilePhoto,
      isAdmin: user?.isAdmin,
      token,
    });
  } catch (err) {
    throw new Error(err);
  }
});

// ---Get All Users ---//
const getAllUsersCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (err) {
    throw new Error(err);
  }
});

// --- Delete User ---//
const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // First checking if id provided is a valid mongoose id
    const isValidId = isValidMongoDbId(id);
    if (!isValidId) {
      throw new Error("Please provide a valid Mongo Id");
    }
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    throw new Error(err);
  }
});

// --- Get Single User ---//
const getSingleUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const isValid = isValidMongoDbId(id);
    if (!isValid) {
      throw new Error("Please provide a valid Mongo Id");
    }
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch {
    throw new Error(err);
  }
});

//---- Get User profile ----// i.e User getting his own profile
const getUserProfileCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const isValid = isValidMongoDbId(id);
    if (!isValid) {
      throw new Error("Invalid Id");
    }
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    throw new Error(err);
  }
});

//---- Update User profile ----// i.e User updating his own profile

const updateProfileCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const isValid = isValidMongoDbId(id);
    if (!isValid) {
      throw new Error("Invalid Id");
    }
    // We'll check if the user trying to update is the same user or user is trying to update somone else's profile ,by comparing with the req.user assigned after authorization

    if (id !== req.user.id) {
      throw new Error("You are not authorized to update this profile");
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // This will run the validators defined in the model
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    throw new Error(err);
  }
});

// ---Update Password ---//
const updatePasswordCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    //Checking if the Mongo id is valid or not
    const isValid = isValidMongoDbId(id);
    if (!isValid) {
      throw new Error("Invalid Id");
    }
    // Checking if the user trying to update is the same user or user is trying to update somone else's profile ,by comparing with the req.user assigned after authorization
    if (id !== req.user.id) {
      throw new Error("You are not authorized to update password");
    }
    // Now checking if sent old password matches the one in the database
    const user = await User.findById(id);
    const { oldPassword } = req.body;
    const verdict = await bcrypt.compare(oldPassword, user.password);
    if (!verdict) {
      throw new Error("Old password is incorrect");
    }
    // => User is authorized to update password and has entered correct previous password
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  registerUserCtrl,
  loginUserCtrl,
  getAllUsersCtrl,
  deleteUserCtrl,
  getSingleUserCtrl,
  getUserProfileCtrl,
  updateProfileCtrl,
  updatePasswordCtrl,
};
