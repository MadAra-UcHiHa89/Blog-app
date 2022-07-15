const User = require("../../model/user/User.model");
const bcrypt = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");

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

    const isMatch = await user.comparePassword(req.body.password);
    console.log(isMatch);
    if (!isMatch) {
      throw new Error("Invalid Credentials");
    }
    res.status(200).json({ message: "Welcome! ", user: user });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { registerUserCtrl, loginUserCtrl };
