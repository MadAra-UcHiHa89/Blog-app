const express = require("express");
const router = express.Router();
const {
  authorizationMiddleware,
} = require("../../middlewares/auth/authMiddleware");
const {
  createCategoryCtrl,
  fetchAllCategoriesCtrl,
  fetchSingleCategoryCtrl,
  updateCategoryCtrl,
} = require("../../controllers/category/category.controller");

// Relative route is: /api/category

// -- Create a new Category --//
router.post("/", authorizationMiddleware, createCategoryCtrl);

// --- Fetch all Categories ---//
router.get("/", authorizationMiddleware, fetchAllCategoriesCtrl);

// ---Fetch A single Category ---//
router.get("/:id", authorizationMiddleware, fetchSingleCategoryCtrl);

// ---Update a Category ---//
// Only the user who created the Category can update the Category
router.put("/:id", authorizationMiddleware, updateCategoryCtrl);

module.exports = router;
