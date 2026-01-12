import React from 'react';
import { useSelector } from 'react-redux';
import { convertWindSpeed, getWindSpeedUnit, convertPressure, getPressureUnit } from '../../utils/unitConverter';
import WeatherIcon from '../WeatherIcon/WeatherIcon';
import styles from './DailyForecast.module.css';

function DailyForecast({ dailyForecast }) {
  const windSpeedUnit = useSelector(function(state) {
    return state.units.windSpeed;
  });
  const pressureUnit = useSelector(function(state) {
    return state.units.pressure;
  });

  if (!dailyForecast || dailyForecast.length === 0) {
    return null;
  }

  function getPeriodLabel(period) {
    switch (period) {
      case 'morning':
        return 'Утро';
      case 'day':
        return 'День';
      case 'evening':
        return 'Вечер';
      case 'night':
        return 'Ночь';
      default:
        return '';
    }
  }

  function renderPeriod(periodData, periodName) {
    if (!periodData) {
      return (
        <div className={styles.periodItem}>
          <div className={styles.periodLabel}>{getPeriodLabel(periodName)}</div>
          <div className={styles.noData}>Нет данных</div>
        </div>
      );
    }

    return (
      <div className={styles.periodItem}>
        <div className={styles.periodHeader}>
          <div className={styles.periodLabel}>{getPeriodLabel(periodName)}</div>
          <div className={styles.periodTime}>{periodData.time}</div>
        </div>
        <div className={styles.periodContent}>
          <div className={styles.periodIcon}>
            <WeatherIcon type={periodData.icon} size="small" />
          </div>
          <div className={styles.periodTemp}>{periodData.temperature}°</div>
          <div className={styles.periodFeelsLike}>Ощущается {periodData.feelsLike}°</div>
          <div className={styles.periodDescription}>{periodData.description}</div>
          <div className={styles.periodDetails}>
            <div className={styles.periodDetail}>Влажность: {periodData.humidity}%</div>
            <div className={styles.periodDetail}>
              Ветер: {convertWindSpeed(periodData.windSpeed, 'ms', windSpeedUnit)} {getWindSpeedUnit(windSpeedUnit)}
            </div>
            <div className={styles.periodDetail}>
              Давление: {convertPressure(periodData.pressure, 'hpa', pressureUnit)} {getPressureUnit(pressureUnit)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Прогноз на 5 дней</h2>
      <div className={styles.forecastList}>
        {dailyForecast.map(function(day, index) {
          return (
            <div key={index} className={styles.dayBlock}>
              <div className={styles.dayHeader}>
                <h3 className={styles.dayDate}>{day.dateString}</h3>
              </div>
              <div className={styles.dayPeriods}>
                {renderPeriod(day.morning, 'morning')}
                {renderPeriod(day.day, 'day')}
                {renderPeriod(day.evening, 'evening')}
                {renderPeriod(day.night, 'night')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyForecast;

