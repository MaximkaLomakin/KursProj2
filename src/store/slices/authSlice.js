import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Асинхронное действие для входа
export const login = createAsyncThunk(
  'auth/login',
  async function(data, { rejectWithValue }) {
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Login error');
    }
  }
);

// Асинхронное действие для регистрации
export const register = createAsyncThunk(
  'auth/register',
  async function(data, { rejectWithValue }) {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Registration error');
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    logout: function(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
    },
    setUser: function(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    clearError: function(state) {
      state.error = null;
    }
  },
  extraReducers: function(builder) {
    builder
      .addCase(login.pending, function(state) {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, function(state, action) {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, function(state, action) {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, function(state) {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, function(state, action) {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, function(state, action) {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

