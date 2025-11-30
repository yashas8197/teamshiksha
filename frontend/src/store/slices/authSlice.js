// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@@@/lib/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@@@/constants";

// Async thunk: login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/auth/login/", { email, password });

      if (data.access) localStorage.setItem(ACCESS_TOKEN, data.access);
      if (data.refresh) localStorage.setItem(REFRESH_TOKEN, data.refresh);

      return data;
    } catch (err) {
      // Normalize DRF error payload
      const message =
        err?.response?.data?.non_field_errors?.[0] ||
        err?.response?.data?.detail ||
        err?.response?.data ||
        err?.message ||
        "Login failed";
      return rejectWithValue(message);
    }
  }
);

// Register new user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/auth/register/", {
        email,
        password,
      });

      // Save tokens in localStorage (automatic login)
      if (data.access) localStorage.setItem(ACCESS_TOKEN, data.access);
      if (data.refresh) localStorage.setItem(REFRESH_TOKEN, data.refresh);

      return data; // includes data.user
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Registration failed";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
    setUserFromLocal(state, action) {
      // optional helper if you decode token on app load
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user ?? null;
        state.isAuthenticated = !!action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user ?? null;
        state.isAuthenticated = !!action.payload.user; // mark as logged in
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, setUserFromLocal } = authSlice.actions;
export default authSlice.reducer;
