import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadWeather } from '../../store/slices/weatherSlice';
import { loadFavorites } from '../../store/slices/favoritesSlice';
import { getWeatherData, getWeatherLoading, getWeatherError, getFavoriteCities } from '../../store/selectors/selectors';
import WeatherCard from '../../components/WeatherCard/WeatherCard';
import DailyForecast from '../../components/DailyForecast/DailyForecast';
import FavoritesList from '../../components/FavoritesList/FavoritesList';
import Loading from '../../components/Loading/Loading';
import styles from './HomePage.module.css';

function HomePage() {
  const dispatch = useDispatch();
  const [city, setCity] = useState('');
  const weatherData = useSelector(getWeatherData);
  const loading = useSelector(getWeatherLoading);
  const error = useSelector(getWeatherError);
  const favoriteCities = useSelector(getFavoriteCities);
  const isAuthenticated = useSelector(function(state) {
    return state.auth.isAuthenticated;
  });

  useEffect(
    function() {
      dispatch(loadWeather(''));
    },
    [dispatch]
  );

  useEffect(
    function() {
      if (isAuthenticated) {
        dispatch(loadFavorites());
      }
    },
    [dispatch, isAuthenticated]
  );

  function handleSearch(event) {
    event.preventDefault();
    if (city.trim()) {
      dispatch(loadWeather(city.trim()));
    }
  }

  function handleCitySelect(selectedCity) {
    setCity(selectedCity);
    dispatch(loadWeather(selectedCity));
  }

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={city}
            onChange={function(e) {
              setCity(e.target.value);
            }}
            placeholder="Введите название города"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton} disabled={loading}>
            {loading ? 'Загрузка...' : 'Найти'}
          </button>
        </form>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {isAuthenticated && favoriteCities.length > 0 && (
        <FavoritesList cities={favoriteCities} onCitySelect={handleCitySelect} />
      )}

      {loading && !weatherData && <Loading />}

      {weatherData && <WeatherCard data={weatherData} />}

      {weatherData && weatherData.dailyForecast && weatherData.dailyForecast.length > 0 && (
        <DailyForecast dailyForecast={weatherData.dailyForecast} />
      )}
    </div>
  );
}

export default HomePage;

