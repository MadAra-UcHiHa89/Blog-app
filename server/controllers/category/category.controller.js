const Category = require("../../model/category/category.model");
const expressAsyncHandler = require("express-async-handler");

// --- Creating a catgory---//
// Endpoint is: POST /api/categories/
// User must be logged in to create a category

const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const createdCategory = await Category.create({
      user: req?.user?._id,
      title: req.body.title,
    });
    res.status(200).json({
      message: "Category created successfully",
      category: createdCategory,
    });
  } catch (err) {
    throw new Error(err);
  }
});

// --- Fetch all categories ---//
const fetchAllCategoriesCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const allCategories = await Category.find({});
    res
      .status(200)
      .json({
        message: "All categories fetched successfully",
        categories: allCategories,
      });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { createCategoryCtrl, fetchAllCategoriesCtrl };
