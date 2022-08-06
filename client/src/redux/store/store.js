import { configureStore } from "@reduxjs/toolkit";
import userSliceReducers from "../slices/user/userSlice";
import categorySliceReducers from "../slices/category/categorySlice";
const store = configureStore({
  reducer: {
    user: userSliceReducers, // reducer of auth Slice
    category: categorySliceReducers
  }
});

export default store;
