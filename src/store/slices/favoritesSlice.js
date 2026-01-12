import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Получение токена из localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Загрузка избранных городов
export const loadFavorites = createAsyncThunk(
  'favorites/loadFavorites',
  async function(_, { rejectWithValue }) {
    try {
      const token = getToken();
      const response = await axios.get(`${API_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.cities;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Favorites loading error');
    }
  }
);

// Добавление города в избранное
export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async function(city, { rejectWithValue }) {
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_URL}/favorites`,
        { city: city },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data.cities;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Add to favorites error');
    }
  }
);

// Удаление города из избранного
export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async function(city, { rejectWithValue }) {
    try {
      const token = getToken();
      const response = await axios.delete(`${API_URL}/favorites`, {
        data: { city: city },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.cities;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Remove from favorites error');
    }
  }
);

const initialState = {
  cities: [],
  loading: false,
  error: null
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: initialState,
  reducers: {
    clearFavorites: function(state) {
      state.cities = [];
    }
  },
  extraReducers: function(builder) {
    builder
      .addCase(loadFavorites.pending, function(state) {
        state.loading = true;
      })
      .addCase(loadFavorites.fulfilled, function(state, action) {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(loadFavorites.rejected, function(state, action) {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToFavorites.fulfilled, function(state, action) {
        state.cities = action.payload;
      })
      .addCase(removeFromFavorites.fulfilled, function(state, action) {
        state.cities = action.payload;
      });
  }
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

