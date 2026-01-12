import { createSelector } from 'reselect';

// Базовые селекторы
const getAuth = function(state) {
  return state.auth;
};

const getWeather = function(state) {
  return state.weather;
};

const getFavorites = function(state) {
  return state.favorites;
};

// Мемоизированные селекторы
export const getUser = createSelector(
  [getAuth],
  function(auth) {
    return auth.user;
  }
);

export const isAuthenticated = createSelector(
  [getAuth],
  function(auth) {
    return auth.isAuthenticated;
  }
);

export const isAdmin = createSelector(
  [getUser],
  function(user) {
    return user?.role === 'admin';
  }
);

export const getWeatherData = createSelector(
  [getWeather],
  function(weather) {
    // Преобразование Immutable структуры в обычный объект
    const data = weather.data;
    if (data && typeof data.toJS === 'function') {
      return data.toJS();
    }
    return data;
  }
);

export const getWeatherLoading = createSelector(
  [getWeather],
  function(weather) {
    return weather.loading;
  }
);

export const getWeatherError = createSelector(
  [getWeather],
  function(weather) {
    return weather.error;
  }
);

export const getFavoriteCities = createSelector(
  [getFavorites],
  function(favorites) {
    return favorites.cities;
  }
);

