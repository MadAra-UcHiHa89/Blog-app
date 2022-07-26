const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Funftion which uploads the image to cloudinary , and returns the url of the image
// This will take the image to upload as the argument (which is required by the uploader.upload function )
const cloudinaryImageUpload = async (fileToUpload) => {
  try {
    const result = await cloudinary.v2.uploader.upload(fileToUpload, {
      resource_type: "auto",
    }); // This method allows us to upload the image/file to cloudinary , first arguemnt is the path of the file to upload , second is the options object where resource_type is auto i.e auto detect the type of the file
    return result; // The whole object containing info about the file uploaded to cloudinary
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { cloudinaryImageUpload };
