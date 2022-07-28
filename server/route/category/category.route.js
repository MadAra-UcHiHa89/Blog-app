const express = require("express");
const router = express.Router();
const {
  authorizationMiddleware,
} = require("../../middlewares/auth/authMiddleware");
const {
  createCategoryCtrl,
  fetchAllCategoriesCtrl,
} = require("../../controllers/category/category.controller");

// Relative route is: /api/category

// -- Create a new Category --//
router.post("/", authorizationMiddleware, createCategoryCtrl);

// --- Fetch all Categories ---//
router.get("/", authorizationMiddleware, fetchAllCategoriesCtrl);

module.exports = router;
