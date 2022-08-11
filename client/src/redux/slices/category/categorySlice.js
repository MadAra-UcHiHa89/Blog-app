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

// Update categor action thunk:

export const updateCategoryAction = createAsyncThunk(
  "/category/update",
  async (details, { rejectWithValue, getState, dispatch }) => {
    try {
      // We'll get id and title from the data object that we pass to this action thunk

      console.log("data in update ", details);
      const respsonse = await fetch(`${baseUrl}/category/${details.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: details.title
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().user.userAuth.token}` // since protected route we need to attach the token, from the store since we have access to the whole state of store in getState
        }
      });
      const data = await respsonse.json();
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

// Delete category action thunk:

export const deleteCategoryAction = createAsyncThunk(
  "/category/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await fetch(`${baseUrl}/category/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().user.userAuth.token}`
        }
      });
      const data = await response.json();
      if (data?.error) {
        return rejectWithValue(data);
      }
      return data;
    } catch (err) {
      if (!err && !err.response) {
        throw err;
      } else {
        return rejectWithValue(err);
      }
    }
  }
);

// fetch single category action thunk:
export const fetchCategoryAction = createAsyncThunk(
  "/category/single",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await fetch(`${baseUrl}/category/${id}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().user.userAuth.token}`
        }
      });
      const data = await response.json();
      if (data?.error) {
        return rejectWithValue(data);
      }
      return data;
    } catch (err) {
      if (!err && !err.response) {
        throw err;
      } else {
        return rejectWithValue(err);
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
  reducers: {
    // resetting edit Action
    resetEditAction: (state, action) => {
      state.updatedCategory = null;
      state.deletedCategory = null;
    },
    resetAddedCategoryAction: (state, action) => {
      state.addedCategory = null;
    }
  },
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
      state.addedCategory = action.payload.category.title;
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
      // state.updatedCategory = null; // Since after updation / deletion of category redirection is based on exitsnece of updatedCategory & deletedCatrgoy state of category slice, so we need to reset it to null once we fectch all categories i.e which is done when we are rendering all categories
      // state.deletedCategory = null;
    },
    [fetchCategoriesAction.rejected]: (state, action) => {
      state.loading = false;
      state.appError = action?.payload.message;
      state.serverError = action?.payload.error;
    },
    // Update category reducers
    [updateCategoryAction.pending]: (state, action) => {
      state.loading = true;
      state.appError = null;
      state.serverError = null;
    },
    [updateCategoryAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.appError = null;
      state.serverError = null;
      state.updatedCategory = action.payload.category.title;
    },
    [updateCategoryAction.rejected]: (state, action) => {
      state.loading = false;
      state.appError = action?.payload.message;
      state.serverError = action?.payload.error;
    },
    // Delete category reducers
    [deleteCategoryAction.pending]: (state, action) => {
      state.loading = true;
      state.appError = null;
      state.serverError = null;
    },
    [deleteCategoryAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.appError = null;
      state.serverError = null;
      state.deletedCategory = action.payload.category.title;
    },
    [deleteCategoryAction.rejected]: (state, action) => {
      state.loading = false;
      state.appError = action?.payload.message;
      state.serverError = action?.payload.error;
    },
    // Fetch single category reducers
    [fetchCategoryAction.pending]: (state, action) => {
      state.loading = true;
      state.appError = null;
      state.serverError = null;
    },
    [fetchCategoryAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.appError = null;
      state.serverError = null;
      state.singleCategory = action.payload.category;
    },
    [fetchCategoriesAction.rejected]: (state, action) => {
      state.loading = false;
      state.appError = action?.payload.message;
      state.serverError = action?.payload.error;
    }
  }
});

export const { resetEditAction, resetAddedCategoryAction } =
  categorySlice.actions; // exporting action creator for resetEdit action for dispatching

export default categorySlice.reducer;
