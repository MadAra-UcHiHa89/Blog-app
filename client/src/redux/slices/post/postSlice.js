import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseUrl from "../../../utils/apiBaseUrl";

export const createPostAction = createAsyncThunk(
  "/post/create",
  async (details, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await fetch(`${baseUrl}/posts`, {
        method: "POST",
        body: JSON.stringify({
          title: details.title,
          description: details.description
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().user.userAuth.token}` // since protected route we need to attach the token, from the store since we have access to the whole state of store in getState
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
  createdPost: null,
  posts: []
};

const postSlice = createSlice({
  name: "post",
  initialState,
  extraReducers: {
    [createPostAction.pending]: (state, action) => {
      state.loading = true;
      state.appError = null;
      state.serverError = null;
    },
    [createPostAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.appError = null;
      state.serverError = null;
      state.createdPost = action?.payload?.post;
    },
    [createPostAction.rejected]: (state, action) => {
      state.loading = false;
      state.appError = action?.payload.message;
      state.serverError = action?.payload.error;
    }
  }
});

export default postSlice.reducer;
