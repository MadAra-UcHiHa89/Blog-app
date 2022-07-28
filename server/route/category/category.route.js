const express = require("express");
const router = express.Router();
const {
  authorizationMiddleware,
} = require("../../middlewares/auth/authMiddleware");
const {
  createCategoryCtrl,
} = require("../../controllers/category/category.controller");

// Relative router is: /api/categories

router.post("/", authorizationMiddleware, createCategoryCtrl);

module.exports = router;
