const mongoose = require("mongoose");

// Schema for users to comuunicate with each other using emails
const emailMessagingSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: [true, "From Email is required"],
    },
    to: {
      type: String,
      required: [true, "To Email is required"],
    },
    // The actual message sent by the sender
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    // The subject of the message
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    // The user who sent the message
    sentBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "User who sent is required is required"],
    },
    // Whether the message is flagged or not (i.e contains profane words or not)
    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamp: true,
  }
);

// Compiling the schema into a model

const EmailMessage = mongoose.model("EmailMessage", emailMessagingSchema);

module.exports = EmailMessage;
