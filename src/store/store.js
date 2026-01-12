import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import weatherReducer from './slices/weatherSlice';
import favoritesReducer from './slices/favoritesSlice';
import unitsReducer from './slices/unitsSlice';
import themeReducer from './slices/themeSlice';
import { logMiddleware } from './middleware/logMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    favorites: favoritesReducer,
    units: unitsReducer,
    theme: themeReducer
  },
  middleware: function(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['weather/loadWeather/fulfilled'],
        ignoredPaths: ['weather.data']
      }
    }).concat(logMiddleware);
  },
  devTools: true
});
