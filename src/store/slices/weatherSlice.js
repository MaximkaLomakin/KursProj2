import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fromJS } from 'immutable';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Получение токена из localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Асинхронное действие для загрузки погоды
export const loadWeather = createAsyncThunk(
  'weather/loadWeather',
  async function(city, { rejectWithValue }) {
    try {
      const token = getToken();
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await axios.get(`${API_URL}/weather`, {
        params: { city: city },
        headers: headers
      });
      // Преобразование данных в Immutable структуру
      return fromJS(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Weather loading error');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState: initialState,
  reducers: {
    clearWeather: function(state) {
      state.data = null;
      state.error = null;
    },
    clearError: function(state) {
      state.error = null;
    }
  },
  extraReducers: function(builder) {
    builder
      .addCase(loadWeather.pending, function(state) {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadWeather.fulfilled, function(state, action) {
        state.loading = false;
        // Сохранение Immutable структуры
        state.data = action.payload;
      })
      .addCase(loadWeather.rejected, function(state, action) {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearWeather, clearError } = weatherSlice.actions;
export default weatherSlice.reducer;

