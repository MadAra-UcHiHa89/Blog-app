const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    // User who created the category (User can create a new category)
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "User who created the category is required"],
    },
    // Title of the category
    title: {
      type: String,
      required: [true, "Category title is required"],
    },
  },
  {
    timestamp: true,
  }
);

// Compiling the schema into a model
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
