const EmailMessage = require("../../model/EmailMessaging/EmailMessaging.model");
const expressAsyncHandler = require("express-async-handler");
const Filter = require("bad-words");
const sendGrid = require("@sendgrid/mail");
sendGrid.setApiKey(process.env.SEND_GRID_API_KEY);

// ----Creating Email Message----//
// Endpoint: POST: /api/email/
const createEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { to, message, subject } = req.body;
    const { id: senderId, email: from } = req.user; //Since user is logged in, we can get the userId from the req.user

    // Checking for profanity in message & subject
    const totalMessage = subject + " " + message;
    const filter = new Filter();
    const profanityCheck = filter.isProfane(totalMessage);
    if (profanityCheck) {
      // => If profanity is found, then do not send email
      throw new Error("Profanity found in message , Cannot send email");
    }

    // Creating the send grid message object
    const sgMessage = {
      to: to,
      subject: subject,
      text: message,
      from: "aadilsaudagar26@gmail.com", // the verified  email id  by sendGrid (i.e blog app owner's email id)
    };

    // Sending the email using send grid
    // await sendGrid.send(sgMessage); // Working !
    // Now after sending the email, we can create a message document & store in the database
    const createdMessage = await EmailMessage.create({
      to: to,
      from: from, // user who is sending the email
      subject: subject,
      message: message,
      sentBy: senderId,
    });

    res.status(200).json({
      message: "Email Message sent successfully",
      emailMsg: createdMessage,
    });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { createEmailMsgCtrl };
