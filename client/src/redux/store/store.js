import { configureStore } from "@reduxjs/toolkit";
import userSliceReducers from "../slices/user/userSlice";
const store = configureStore({
  reducer: {
    user: userSliceReducers, // reducer of auth Slice
  },
});

export default store;
