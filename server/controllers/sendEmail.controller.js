require("dotenv").config();
const sgEmail = require("@sendgrid/mail"); // The sendgrid object which has methods to send the email
const expressAsyncHandler = require("express-async-handler");
sgEmail.setApiKey(process.env.SEND_GRID_API_KEY); // Setting the API key for the sendgrid object

// We can use the sgObject.send(message) method to send the email , Syntax on their site

const msg = {
  to: "aadilsaudagar24@gmail.com", // Change to your recipient
  from: "aadilsaudagar26@gmail.com", // Change to your verified sender
  subject: "Blog App - Email Verification",
  text: "Just testing",
  html: "<h2>Just testing</h2>",
};

const sendEmailCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { email: receiverEmailId } = req.body;
    msg.to = receiverEmailId;
    const response = await sgEmail.send(msg);
    console.log(response);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { sendEmailCtrl };
