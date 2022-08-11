import { configureStore } from "@reduxjs/toolkit";
import userSliceReducers from "../slices/user/userSlice";
import categorySliceReducers from "../slices/category/categorySlice";
import postSliceRedcuers from "../slices/post/postSlice";
const store = configureStore({
  reducer: {
    user: userSliceReducers, // reducer of auth Slice
    category: categorySliceReducers,
    post: postSliceRedcuers
  }
});

export default store;
