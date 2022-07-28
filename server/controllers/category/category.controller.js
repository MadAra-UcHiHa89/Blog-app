const Category = require("../../model/category/category.model");
const expressAsyncHandler = require("express-async-handler");

// --- Creating a catgory---//
// Endpoint is: POST /api/categories/
// User must be logged in to create a category

const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
  try {
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { createCategoryCtrl };
