const User = require("../../model/user/User.model");
const bcrypt = require("bcryptjs");
const sgEmail = require("@sendgrid/mail"); // The sendgrid object which has methods to send the email
const expressAsyncHandler = require("express-async-handler");
const { generateToken } = require("../..//config/token/generateToken");
const { isValidMongoDbId } = require("../../utils/validateMongoDBId");
const { cloudinaryImageUpload } = require("../../utils/cloudinary");
const crypto = require("crypto");
const fs = require("fs");

sgEmail.setApiKey(process.env.SEND_GRID_API_KEY); // Setting the API key for the sendgrid object

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
      password: req?.body?.password
    });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// ---Login User ---//
const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req?.body?.email });
  if (!user) {
    throw new Error("User not found");
  }
  try {
    const isMatch = await user.comparePassword(req?.body?.password);
    const valid = await bcrypt.compare(req?.body?.password, user?.password);
    console.log(req.body.password);

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
      token
    });
  } catch (err) {
    throw new Error(err.message);
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
    if (id === req.user.id || req.user.isAdmin) {
      const deletedUser = await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      throw new Error("Not authorized to delete this user");
    }
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
    if (id === req.user.id) {
      const user = await User.findById(id)
        .populate("posts")
        .populate("comments"); // populating the posts virtual property with the posts created by the user i.e posts having auth field's value == user id
      // Amd populating the comments virtual property with the comments created by the user i.e comments having user field's value (in Comment documents ) == user id
      res.status(200).json(user);
    } else {
      throw new Error("Not authorized to view this profile");
    }
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
      throw new Error("Invalid Mongo Id");
    }
    // We'll check if the user trying to update is the same user or user is trying to update somone else's profile ,by comparing with the req.user assigned after authorization

    if (id !== req.user.id) {
      throw new Error("You are not authorized to update this profile");
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true // This will run the validators defined in the model
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

//--- Follow User ---//
// Here receiver -> user who is being followed , sender -> user who is following
const followUserCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: receiverId } = req.body;
    const { id: senderId } = req.user;
    const isValid = isValidMongoDbId(receiverId);
    if (!isValid) {
      throw new Error("Invalid Mongo Id of receiver");
    }

    // First checking if sender is already following the receiver or not
    const sender = await User.findById(senderId);
    const isFollowing = sender.following.includes(receiverId);
    if (isFollowing) {
      // => User is already following the receiver, thus no need to push
      throw new Error("You are already following this user");
    }

    // If reached here then user is not following the receiver

    // Updating the following field of the sender
    const updatedSender = await User.findByIdAndUpdate(
      senderId,
      {
        // Method-1: Prevent duplicates using $addToSet
        // Method-2: Prevent duplicates by checking in either the sender's followers or the receiver's following array , if they follow then we do not push and send message that aleady following to the frontend

        // $push: { following: receiverId }  push allows duplicates in array so we'll use $addToSet to add only unique values and prevent duplicates
        $addToSet: { following: receiverId },
        isFollowing: true // Used to indicate that the user follows at least one user
      },
      { new: true, runValidators: true }
    );
    // Updating the followers field of the receiver
    const updatedReceiver = await User.findByIdAndUpdate(
      receiverId,
      {
        $addToSet: { followers: senderId }
        // $push: { followers: senderId } push allows duplicates in the array , so we'll use $addToSet to prevent duplicates
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      message: "You have successfully followed that User",
      sender: updatedSender,
      receiver: updatedReceiver
    });
  } catch (err) {
    throw new Error(err);
  }
});

//--- Unfollow User ---//
// Here receiver -> user who is being unfollowed , sender -> user who is unfollowing
// Before starting to unfollow a user , we'll check if the user is following the other user or not, if not then we'll send a message that user is not following the other user
// 1] Same remove reciver id from sender's following array
// 2] Remove sender id from receiver's followers array
// 3] Send a message to the frontend that you have successfully unfollowed that user
const unfollowUserCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: receiverId } = req.body;
    const { id: senderId } = req.user;
    const isValid = isValidMongoDbId(receiverId);
    if (!isValid) {
      throw new Error("Invalid Mongo Id of receiver");
    }
    // First checking if sender is  following the receiver or not
    const sender = await User.findById(senderId);
    const isFollowing = sender.following.includes(receiverId);
    console.log(isFollowing);
    if (!isFollowing) {
      throw new Error("You are not following this user, So cannot unfollow");
    }

    // If reached here then user is following the receiver
    // Updating the following field of the sender (using $pull operator)
    const updatedSender = await User.findByIdAndUpdate(
      senderId,
      { $pull: { following: receiverId }, isFollowing: false },
      { new: true, runValidators: true }
    );
    // Updating the receivers followes field by removing the sender id from the array (using $pull operator)
    const updatedReceiver = await User.findByIdAndUpdate(
      receiverId,
      { $pull: { followers: senderId } },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      message: "You have successfully unfollowed that User",
      sender: updatedSender,
      receiver: updatedReceiver
    });
  } catch (err) {
    throw new Error(err);
  }
});

// ---Block User ---//
const blockUserCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: userToBlock } = req.params;
    const isValid = isValidMongoDbId(userToBlock);
    if (!isValid) {
      throw new Error("Invalid Mongo Id");
    }
    // Only the admin can block the user => Checking if the user is admin or not , by checking the role field in the req.user
    // So we created a middleware to check if user is admin or not, if yes ten only this controller is run
    const updatedUser = await User.findByIdAndUpdate(
      userToBlock,
      { isBlocked: true },
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ message: "Blocked User Successfully", user: updatedUser });
  } catch (err) {
    throw new Error(err);
  }
});

// --- Unblock User --- //
const unblockUserCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: userToUnblock } = req.params;
    const isValid = isValidMongoDbId(userToUnblock);
    if (!isValid) {
      throw new Error("Invalid Mongo Id");
    }
    const updatedUser = await User.findByIdAndUpdate(
      userToUnblock,
      { isBlocked: false },
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ message: "Unblocked User Successfully", user: updatedUser });
  } catch (err) {
    throw new Error(err);
  }
});

// ---Account Verification By Sending Email (Through Email) --- //

const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    // We need to call the genearte token function of the user model , so that we can generate a token for verification of user
    // So finding the user by id
    const user = await User.findById(id);
    if (!user.isAccountVerified) {
      // User not verified yet
      // Generating a token
      const accountVerificationToken =
        await user.createAccountVerificationToken(); // calling the schema method which geneartes token (using cryptp) and assigns the fields in that document
      // awaiting since the method is async as it makes changes to the document in the database
      // console.log(accountVerificationToken);
      await user.save(); // Have to save the user manually since we are doing changes to the dcoement directly from method in app and not using update methods

      const verifyURL = `If you requested to verify your account, please click on the following link: <a href="http://localhost:6000/api/users/verify-account/${accountVerificationToken}">Click Here To Verify!</a> in 10 minutes !, If not then ignore `;
      // The href should be to the frontend page where the page will send a reuest to verify account to the backend on mounting. and display message based on the response
      const msg = {
        to: req.body.email, // Change to your recipient
        from: "aadilsaudagar26@gmail.com", // Change to your verified sender
        subject: "Blog App - Email Verification",
        // text: "Just testing",
        html: verifyURL
      };

      const response = await sgEmail.send(msg);
      // console.log(response);
      // res.status(200).json({ message: "Email Sent" });
      res.status(200).json(verifyURL);
    } else {
      // user already verified
      res.status(200).json({ message: "User Already Verified" });
    }
  } catch (err) {
    throw new Error(err);
  }
});

//--- Verify Account ---//
const verifyAccountCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { token } = req.params;
    const hashedPassword = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex"); // Hashing the token
    // Getting user by the hashed password thus if there exits a user => then the token is valid, else token is invalid
    const user = await User.findOne({
      accountVerificationToken: hashedPassword
    });
    if (!user) {
      throw new Error("Invalid Token");
    }
    // => Token is valid , Now checking if token has expired or not
    if (user.accountVerificationTokenExpires < Date.now()) {
      throw new Error("Token Expired");
    }
    // Token valid and not expired hence can verify the user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        isAccountVerified: true,
        accountVerificationToken: "",
        accountVerificationTokenExpires: ""
      },
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ message: "Account Verified Successfully", user: updatedUser });
  } catch (err) {
    throw new Error(err);
  }
});

// ---Generate token for resetting password --- //

const forgotPasswordTokenCtrl = expressAsyncHandler(async (req, res) => {
  try {
    // user hasn't logged in since forgot the password so he has entered his / her email in the request
    const { email } = req.body;
    //finding that user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      // => User provided isnt registered to the platform
      throw new Error("User Not Found");
    }

    // Generating a token for forgot password and storing it in the user document
    const fpasswordToken = await user.createPasswordResetToken();
    // Saving the user document changes to the database
    await user.save();
    // Now will send the raw token to the user's email

    const resetURL = `If you requested to reset your password <br> Code: <h5>${fpasswordToken}</h5>  <br>please click on the following link: <a href="http://localhost:6000/api/users/verify-account/${fpasswordToken}">Click Here To Reset!</a>. Respond within 10 minutes !, If not then ignore `;
    const msg = {
      to: user.email,
      from: "aadilsaudagar26@gmail.com", // verified sender address of send grid
      subject: "Blog App - Password Reset",
      // text: "Just testing",
      html: resetURL
    };
    // Now sending the email
    const response = await sgEmail.send(msg);
    res.status(200).json({
      message: `Verification message sent to ${email}. Reset within 10 Minutes `,
      resetURL
    });
  } catch (err) {
    throw new Error(err);
  }
});

// --- Forgot Password --- //

const forgotPasswordCtrl = expressAsyncHandler(async (req, res) => {
  try {
    // The token user got from email , will send it in the request body to this endpoint
    const { token, newPassword } = req.body;
    // If user exits with hash of token ==  passwordResetToken field then token is valid , else token is invalid

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    // Now will find the user with passwordResetToken == hashedToken and if user exists then token is valid
    const user = await User.findOne({ passwordResetToken: hashedToken });
    if (!user) {
      // => Token is invalid
      throw new Error("Invalid Token/Code");
    }
    // => Token is valid , Now checking if token has expired or not
    if (user.passwordResetTokenExpires < Date.now()) {
      // Token expired
      throw new Error("Token Expired");
    }
    // Token valid and not expired hence can reset the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const id = user._id;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
        passwordResetToken: "",
        passwordResetTokenExpires: ""
      },
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ message: "Password Reset Successfully", user: updatedUser });
  } catch (err) {
    throw new Error(err);
  }
});

// --- Profile Photo Upload --- //
// endpoint: /api/users/profile-photo-upload
const profilePhotoUploadCtrl = expressAsyncHandler(async (req, res) => {
  try {
    console.log("req", req.file);
    const { id } = req.user; // Since this router is only accessible by the logged in user, so we can get the user id from the req.user to get id of te user
    // 1. Getting the local path of file to be uploaded
    const localPath = `public/images/profile/${req.file.filename}`;
    const uploadedFile = await cloudinaryImageUpload(localPath); // providing the path of file to be uploaded

    // Once the file has been uploaded to cloudinary, we can delete the local file
    fs.unlinkSync(localPath);

    // Now will store the url of the uploaded file in the user document
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePhoto: uploadedFile?.secure_url },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "Succesfully ploaded image", updatedUser });
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
  followUserCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unblockUserCtrl,
  generateVerificationTokenCtrl,
  verifyAccountCtrl,
  forgotPasswordTokenCtrl,
  forgotPasswordCtrl,
  profilePhotoUploadCtrl
};
