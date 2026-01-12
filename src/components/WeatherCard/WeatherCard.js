import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';
import { getFavoriteCities } from '../../store/selectors/selectors';
import { convertWindSpeed, getWindSpeedUnit, convertPressure, getPressureUnit } from '../../utils/unitConverter';
import WeatherIcon from '../WeatherIcon/WeatherIcon';
import HourlyForecastSlider from '../HourlyForecastSlider/HourlyForecastSlider';
import UnitsSelector from '../UnitsSelector/UnitsSelector';
import styles from './WeatherCard.module.css';

function WeatherCard({ data }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(function(state) {
    return state.auth.isAuthenticated;
  });
  const favoriteCities = useSelector(getFavoriteCities);
  const cityInFavorites = favoriteCities.includes(data.city);
  const windSpeedUnit = useSelector(function(state) {
    return state.units.windSpeed;
  });
  const pressureUnit = useSelector(function(state) {
    return state.units.pressure;
  });

  function handleFavorite() {
    if (!isAuthenticated) {
      return;
    }
    if (cityInFavorites) {
      dispatch(removeFromFavorites(data.city));
    } else {
      dispatch(addToFavorites(data.city));
    }
  }

  if (!data) {
    return null;
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.city}>{data.city}</h2>
        <div className={styles.headerButtons}>
          <UnitsSelector />
          {isAuthenticated && (
            <button
              onClick={handleFavorite}
              className={cityInFavorites ? styles.inFavorites : styles.notInFavorites}
              aria-label={cityInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={cityInFavorites ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <div className={styles.mainInfo}>
            <WeatherIcon type={data.icon} />
            <div className={styles.temperature}>{data.temperature}°C</div>
          </div>
          <div className={styles.description}>{data.description}</div>
          <div className={styles.details}>
            <div className={styles.detail}>
              <span className={styles.label}>Влажность:</span>
              <span className={styles.value}>{data.humidity}%</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Ветер:</span>
              <span className={styles.value}>
                {convertWindSpeed(data.windSpeed, 'ms', windSpeedUnit)} {getWindSpeedUnit(windSpeedUnit)}
              </span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Давление:</span>
              <span className={styles.value}>
                {convertPressure(data.pressure, 'hpa', pressureUnit)} {getPressureUnit(pressureUnit)}
              </span>
            </div>
          </div>
        </div>
        {data.hourlyForecast && data.hourlyForecast.length > 0 && (
          <div className={styles.rightSection}>
            <HourlyForecastSlider hourlyForecast={data.hourlyForecast} />
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherCard;

