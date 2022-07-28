const express = require("express");
const router = express.Router();
const {
  authorizationMiddleware,
} = require("../../middlewares/auth/authMiddleware");
const {
  createEmailMsgCtrl,
} = require("../../controllers/EmailMessaging/EmailMessaging.controller");

// Create a new Email Message
// Endpoint is: POST /api/email/

router.post("/", authorizationMiddleware, createEmailMsgCtrl);

module.exports = router;
