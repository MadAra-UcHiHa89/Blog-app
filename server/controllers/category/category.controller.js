const Category = require("../../model/category/category.model");
const expressAsyncHandler = require("express-async-handler");
const { isValidMongoDbId } = require("../../utils/validateMongoDBId");

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
    const allCategories = await Category.find({})
      .populate("user")
      .sort("-createdAt"); // Sorting in descending order of createdAt
    res.status(200).json({
      message: "All categories fetched successfully",
      categories: allCategories,
    });
  } catch (err) {
    throw new Error(err);
  }
});

// --- Fetch a single category ---//
// Endpoint is: GET /api/categories/:categoryId
const fetchSingleCategoryCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: categoryId } = req.params;
    const isValidId = isValidMongoDbId(categoryId);
    if (!isValidId) {
      throw new Error("Invalid Category Id");
    }
    const fetchedCategory = await Category.findById(categoryId).populate(
      "user"
    );
    res.status(200).json({
      message: "Fetched category successfully",
      category: fetchedCategory,
    });
  } catch (err) {
    throw new Error(err);
  }
});

// --- Update a category ---//
const updateCategoryCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: categoryId } = req.params;
    const { title } = req.body; // Since only title of a category can be updated && user who created the category can only update it i.e admin
    const { id: userId } = req.user;
    const isValidId = isValidMongoDbId(categoryId);
    if (!isValidId) {
      throw new Error("Invalid Category Id");
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    // Now checking if loggen in user is the user who created the category
    const isUserAuthorized = category.user == userId;
    if (!isUserAuthorized) {
      throw new Error("You are not authorized to update this category");
    }
    // Now updating the category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (err) {
    throw new Error(err);
  }
});

// --- Delete a category ---//
// -- Only the user who created the category can delete the category --//

const deleteCategoryCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id: categoryId } = req.params;
    const { id: userId } = req.user;
    const isValidId = isValidMongoDbId(categoryId);
    if (!isValidId) {
      throw new Error("Invalid Category Id");
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    // Now checking if loggen in user is the user who created the category
    const isUserAuthorized = category.user == userId;
    if (!isUserAuthorized) {
      throw new Error("You are not authorized to delete this category");
    }
    // Now deleting the category
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    res.status(200).json({
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createCategoryCtrl,
  fetchAllCategoriesCtrl,
  fetchSingleCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
};
