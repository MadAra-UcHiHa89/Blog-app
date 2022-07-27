const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
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
    isBlocked: {
      type: Boolean, // Is the user blocked by the admin
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Blogger"], // To ensure value of the field is only one of the three
    },
    isFollowing: {
      type: Boolean, // To check if the user is following someone or not
      default: false,
    },

    isFollowing: {
      type: Boolean, // To check if the user is following someone or not
      default: false,
    },
    isAccountVerified: {
      type: Boolean, // To check if the user's account is verified or not
      default: false,
    },
    accountVerificationToken: {
      type: String,
    },
    accountVerificationTokenExpires: {
      type: Date, // Time / date when the account verification token expires
    },
    viewedBy: [
      {
        type: mongoose.Schema.Types.ObjectId, // Defining the data type of the field i.e the id of ducements
        ref: "User", // To specify the name of the model whose document's id its storing in the field / whose dosuments its referencing
        //   Value of ref must be the name of the model specified in the mongoose.model() method
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    passwordChangedAt: Date, // To store the time / date when the user changed his password
    passwordResetToken: String, // To store the token when the user requests for a password reset
    passwordResetTokenExpires: Date, // To store the time / date when the password reset token expires
    active: {
      type: Boolean, // is user currently active or not i.e using the web application or not
      default: false,
    },
  },
  {
    // Options object
    timestamps: true, // To create a field that stores the time / date when the user was created and updated
    toJSON: {
      virtuals: true, // To convert each document in model to JSON object
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Creating a virtual property which refrences the posts created by the current user
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
});

//Since hashing isnt part of the controller and is part of the model we have tp hash the password before we save it to the database
// Before saving the user to the database, we'll hash the password
userSchema.pre("save", async function (next) {
  console.log(this);
  const hashedPassword = await bcrypt.hash(this.password, 10); // this.password is the password that the user has entered / belongs to the document
  this.password = hashedPassword; // updating the pasword field with the hashed password
  next();
});

// Hased password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password); // this.password is the hashed password that is stored in the database
};

// Creating the token for verification and assigning to the fields

userSchema.methods.createAccountVerificationToken = async function () {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  this.accountVerificationToken = hashedToken; // assigning the hashed token to the accountVerificationToken field of the document
  this.accountVerificationTokenExpires = Date.now() + 1000 * 60 * 10; // setting the expiry time of the token to 10 minutes from the time user sends the reqruest for verification of account
  return token; // returning the token to the controller so it can send it to the frontend
};

userSchema.methods.createPasswordResetToken = async function () {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  this.passwordResetToken = hashedToken; // assigning the hashed token to the passwordResetToken field of the document
  this.passwordResetTokenExpires = Date.now() + 1000 * 60 * 10; // setting the expiry time of the token to 10 minutes from the time user sends the reqruest for verification of account
  return token; // returning the token to the controller so it can send it to the frontend
};

// Comiling the schema to a model

const User = mongoose.model("User", userSchema);

module.exports = User;
