import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseUrl from "../../../utils/apiBaseUrl";

// register async thunk action creator for userSlice , i.e before dispatching the action,
// Thunk will perform async task and then dispatch the action, and accordingly reducer will update the slice.

export const registerUserAction = createAsyncThunk(
  "user/register",
  async (details, { rejectWithValue, getState, dispatch }) => {
    const { firstName, lastName, email, password } = details; // payload of the action
    console.log("details", details);
    try {
      const response = await fetch(`${baseUrl}/users/register`, {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password }),

        headers: {
          "Content-Type": "application/json"
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
        // => not a network error
        return rejectWithValue(err.response.data); // i.e response but an error repsonse we need to show the error to the user
      }
    }
  }
);

export const loginUserAction = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      const { email, password } = userData;
      const response = await fetch(`${baseUrl}/users/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json"
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
        // => not a network error
        return rejectWithValue(err.response.data); // i.e response but an error repsonse we need to show the error to the user
      }
    }
  }
);

const getUserAuthDetailFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  registered: null,
  loading: false,
  appError: null,
  serverError: null,
  userAuth: getUserAuthDetailFromStorage // if user is logged in then we'll get the userAuth from localStorage in order to obtain persisitence of login
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  extraReducers: {
    // Using Map Notation
    [registerUserAction.pending]: (state, action) => {
      state.loading = true;
      state.appError = null;
      state.serverError = null;
    },
    [registerUserAction.fulfilled]: (state, action) => {
      // => registered successfully , so we need to update the state with the user details

      state.loading = false;
      state.registered = action.payload; // user details received from the server after registration
      state.appError = null;
      state.serverError = null;
    },
    [registerUserAction.rejected]: (state, action) => {
      state.loading = false;
      state.appError = action?.payload?.message; // i.e error due to some mongo validation & not server being down , i.e error object being returned
      state.serverError = action?.payload?.message; // i.e error due to server being down , i.e error object being returned
    },
    // Reducers for login thunk action creator
    [loginUserAction.pending]: (state, action) => {
      state.loading = true;
      state.appError = null;
      state.serverError = null;
    },
    [loginUserAction.fulfilled]: (state, action) => {
      // We'll store the user details in the local storage
      state.loading = false;
      state.appError = null;
      state.serverError = null;
      state.userAuth = action?.payload; // user details received from the server after login (part of user slice storing info about user authentication)
      localStorage.setItem("user", JSON.stringify(action.payload)); // stringify since localStorage only accepts strings
    },
    [loginUserAction.rejected]: (state, action) => {
      state.loading = false;
      state.appError = action?.payload?.message; // i.e error due to some mongo validation & not server being down , i.e error object being returned
      state.serverError = action?.payload?.message; // i.e error due to server being down , i.e error object being returned
    }
  }
});

export default userSlice.reducer; // exporting the reducers os slice , to be used in the store configuration
