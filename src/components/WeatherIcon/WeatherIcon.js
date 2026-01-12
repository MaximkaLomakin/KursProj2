import React from 'react';
import styles from './WeatherIcon.module.css';

function WeatherIcon({ type, size = 'normal' }) {
  const iconSize = size === 'small' ? 50 : 100;
  const iconClass = size === 'small' ? styles.iconSmall : styles.icon;

  function getIcon() {
    switch (type) {
      case 'Clear':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 100 100" className={iconClass}>
            <circle cx="50" cy="50" r="30" fill="#ffd700" />
            <circle cx="50" cy="50" r="25" fill="#ffed4e" />
          </svg>
        );
      case 'Clouds':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 100 100" className={iconClass}>
            <path
              d="M30 50 Q30 30 50 30 Q70 30 70 50 Q80 50 80 60 Q80 70 70 70 L30 70 Q20 70 20 60 Q20 50 30 50"
              fill="#e0e0e0"
            />
            <path
              d="M20 45 Q20 30 35 30 Q50 30 50 45 Q55 45 55 50 Q55 55 50 55 L20 55 Q15 55 15 50 Q15 45 20 45"
              fill="#f5f5f5"
            />
          </svg>
        );
      case 'Rain':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 100 100" className={iconClass}>
            <path
              d="M30 50 Q30 30 50 30 Q70 30 70 50 Q80 50 80 60 Q80 70 70 70 L30 70 Q20 70 20 60 Q20 50 30 50"
              fill="#9e9e9e"
            />
            <line x1="35" y1="75" x2="35" y2="85" stroke="#2196f3" strokeWidth="3" />
            <line x1="45" y1="75" x2="45" y2="85" stroke="#2196f3" strokeWidth="3" />
            <line x1="55" y1="75" x2="55" y2="85" stroke="#2196f3" strokeWidth="3" />
            <line x1="65" y1="75" x2="65" y2="85" stroke="#2196f3" strokeWidth="3" />
          </svg>
        );
      case 'Snow':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 100 100" className={iconClass}>
            <path
              d="M30 50 Q30 30 50 30 Q70 30 70 50 Q80 50 80 60 Q80 70 70 70 L30 70 Q20 70 20 60 Q20 50 30 50"
              fill="#e0e0e0"
            />
            <circle cx="35" cy="75" r="3" fill="#fff" />
            <circle cx="50" cy="80" r="3" fill="#fff" />
            <circle cx="65" cy="75" r="3" fill="#fff" />
            <circle cx="45" cy="85" r="2" fill="#fff" />
            <circle cx="55" cy="85" r="2" fill="#fff" />
          </svg>
        );
      case 'Thunderstorm':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 100 100" className={iconClass}>
            <path
              d="M30 50 Q30 30 50 30 Q70 30 70 50 Q80 50 80 60 Q80 70 70 70 L30 70 Q20 70 20 60 Q20 50 30 50"
              fill="#424242"
            />
            <path d="M45 50 L55 70 L50 70 L60 90 L50 70 L55 70 L45 50" fill="#ffd700" />
          </svg>
        );
      default:
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 100 100" className={iconClass}>
            <circle cx="50" cy="50" r="30" fill="#e0e0e0" />
          </svg>
        );
    }
  }

  return <div className={styles.container}>{getIcon()}</div>;
}

export default WeatherIcon;

