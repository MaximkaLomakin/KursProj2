import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { convertWindSpeed, getWindSpeedUnit, convertPressure, getPressureUnit } from '../../utils/unitConverter';
import WeatherIcon from '../WeatherIcon/WeatherIcon';
import styles from './HourlyForecastSlider.module.css';

function HourlyForecastSlider({ hourlyForecast }) {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const windSpeedUnit = useSelector(function(state) {
    return state.units.windSpeed;
  });
  const pressureUnit = useSelector(function(state) {
    return state.units.pressure;
  });

  function updateScrollButtons() {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }

  useEffect(
    function() {
      if (!hourlyForecast || hourlyForecast.length === 0) {
        return;
      }
      updateScrollButtons();
      const slider = sliderRef.current;
      if (slider) {
        slider.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);
        return function() {
          slider.removeEventListener('scroll', updateScrollButtons);
          window.removeEventListener('resize', updateScrollButtons);
        };
      }
    },
    [hourlyForecast]
  );

  if (!hourlyForecast || hourlyForecast.length === 0) {
    return null;
  }

  function scrollLeft() {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }

  function scrollRight() {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Прогноз по часам</h3>
      <div className={styles.sliderWrapper}>
        {canScrollLeft && (
          <button className={styles.scrollButtonLeft} onClick={scrollLeft}>
            ‹
          </button>
        )}
        <div className={styles.slider} ref={sliderRef}>
          {hourlyForecast.map(function(item, index) {
            return (
              <div key={index} className={styles.hourItem}>
                <div className={styles.time}>{item.time}</div>
                <div className={styles.iconWrapper}>
                  <WeatherIcon type={item.icon} size="small" />
                </div>
                <div className={styles.temperature}>{item.temperature}°</div>
                <div className={styles.feelsLike}>Ощущается {item.feelsLike}°</div>
                <div className={styles.description}>{item.description}</div>
                <div className={styles.additionalInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Влажность:</span>
                    <span className={styles.infoValue}>{item.humidity}%</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Ветер:</span>
                    <span className={styles.infoValue}>
                      {convertWindSpeed(item.windSpeed, 'ms', windSpeedUnit)} {getWindSpeedUnit(windSpeedUnit)}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Давление:</span>
                    <span className={styles.infoValue}>
                      {convertPressure(item.pressure, 'hpa', pressureUnit)} {getPressureUnit(pressureUnit)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {canScrollRight && (
          <button className={styles.scrollButtonRight} onClick={scrollRight}>
            ›
          </button>
        )}
      </div>
    </div>
  );
}

export default HourlyForecastSlider;

