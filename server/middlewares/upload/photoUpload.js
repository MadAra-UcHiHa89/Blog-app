const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// Multer for handling file uploads

// Since we want to store the file only temporarily, we'll use the memory storage
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  // file -> represents the file that is being uploaded
  // mimetype -> represents the type of file that is being uploaded
  if (file.mimetype.startsWith("image")) {
    cb(null, true); // cb(null,true) => means that the file is allowed to be uploaded ,For cb: 1st argument is error object (can be customised) , second is true or false => accepted or rejected
  } else {
    // reject the file
    cb({ message: "Unsupported file type" }, false); // 1st argument is error object , 2nd is true or false => accepted or rejected
  }
};

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1000000 // 1MB = 1000000 bytes
  }
});

// Profile photo resizing using sharp
const profilePhotoResize = async (req, res, next) => {
  // multer populates the req.file object with the file uploaded (Note: this middleware ,must come after the multer middleware else req.file wont be populated)
  // Checking if file is there or not
  if (!req.file) {
    // => No file uploaded no need to resize the image/ file
    next();
  }
  // => File is uploaded , so we'll resize the image
  // We'll change the name of the file to be unique and random so that it doesn't overwrite the existing image / due to same names
  //   So we cerate our own prooerty called fileName on the req.file object
  req.file.filename = `user-${Date.now()}-${req?.file?.originalname}`; // req.file.originalname -> represents the name of the file that is being uploaded , Date.now() -> represents the current time in milliseconds so that it will be unique

  await sharp(req?.file?.buffer) // sharp() function takes in the req.file.buffer as argument which contains the bytes of the image that is being uploaded
    .resize(250, 250) // resize the image to 250x250
    .toFormat("jpeg") // convert the image to jpeg format
    .toFile(
      `${path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        "profile",
        req.file.filename
      )}`
    ); // path where the image will be stored on the server
  next();
};

// Post Photo resizing using sharp (Same just the path where post picutures wil be saved is different)
const postPhotoResize = async (req, res, next) => {
  // multer populates the req.file object with the file uploaded (Note: this middleware ,must come after the multer middleware else req.file wont be populated)
  // Checking if file is there or not
  if (!req.file) {
    // => No file uploaded no need to resize the image/ file
    console.log("no file uploaded post");
    next();
  }
  console.log("after next");
  // => File is uploaded , so we'll resize the image
  // We'll change the name of the file to be unique and random so that it doesn't overwrite the existing image / due to same names
  //   So we cerate our own prooerty called fileName on the req.file object
  req.file.filename = `user-${Date.now()}-${req?.file?.originalname}`; // req.file.originalname -> represents the name of the file that is being uploaded , Date.now() -> represents the current time in milliseconds so that it will be unique

  await sharp(req.file.buffer) // sharp() function takes in the req.file.buffer as argument which contains the bytes of the image that is being uploaded
    .resize(500, 500) // resize the image to 500x500
    .toFormat("jpeg") // convert the image to jpeg format
    .toFile(
      `${path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        "post",
        req.file.filename
      )}`
    ); // path where the image will be stored on the server
  next();
};

module.exports = { photoUpload, postPhotoResize, profilePhotoResize };
