import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseUrl from "../../../utils/apiBaseUrl";

export const createCategoryAction = createAsyncThunk(
  "/category/create",
  async (category, { rejectWithValue, getState, dispatch }) => {
    try {
      // Making the call to create a category
      const response = await fetch(`${baseUrl}/category`, {
        method: "POST",
        body: JSON.stringify({
          title: category?.title
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().user.userAuth.token}` // since protected route we need to attach the token, from the store since we have access to the whole state of store in getState
        }
      });
      const data = await response.json();
      console.log("data", data);
      if (data?.error) {
        return rejectWithValue(data);
      }
      return data;
    } catch (err) {
      if (!err && !err.response) {
        throw err;
      } else {
        // => not a network error
        return rejectWithValue(err); // i.e response but an error repsonse we need to show the error to the user
      }
    }
  }
);

// fetching all categories action
export const fetchCategoriesAction = createAsyncThunk(
  "/category/fetch",
  async (category, { rejectWithValue, getState, dispatch }) => {
    try {
      // Making the call to create a category
      const response = await fetch(`${baseUrl}/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().user.userAuth.token}` // since protected route we need to attach the token, from the store since we have access to the whole state of store in getState
        }
      });
      const data = await response.json();
      console.log("data", data);
      if (data?.error) {
        return rejectWithValue(data);
      }
      return data;
    } catch (err) {
      if (!err && !err.response) {
        throw err;
      } else {
        // => not a network error
        return rejectWithValue(err); // i.e response but an error repsonse we need to show the error to the user
      }
    }
  }
);

const initialState = {
  loading: false,
  category: "Node Js", // new Category  Created by admin
  appError: null,
  serverError: null,
  categoryList: [] // list of categories created by admin
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  extraReducers: {
    [createCategoryAction.pending]: (state, action) => {
      state.loading = true;
      state.appError = null;
      state.serverError = null;
    },
    [createCategoryAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.appError = null;
      state.serverError = null;
      state.category = action.payload.category.title;
    },
    [createCategoryAction.rejected]: (state, action) => {
      console.log("action", action);
      state.loading = false;
      state.appError = action?.payload.message;
      state.serverError = action?.payload.error;
    },
    // Fetch all categories reducers
    [fetchCategoriesAction.pending]: (state, action) => {
      state.loading = true;
      state.appError = null;
      state.serverError = null;
    },
    [fetchCategoriesAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.appError = null;
      state.serverError = null;
      state.categoryList = action.payload.categories;
    },
    [fetchCategoriesAction.rejected]: (state, action) => {
      state.loading = false;
      state.appError = action?.payload.message;
      state.serverError = action?.payload.error;
    }
  }
});

export default categorySlice.reducer;
