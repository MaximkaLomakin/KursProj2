import React from 'react';
import styles from './FavoritesList.module.css';

function FavoritesList({ cities, onCitySelect }) {
  if (!cities || cities.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Избранные города</h3>
      <div className={styles.list}>
        {cities.map(function(city, index) {
          return (
            <button
              key={`city-${index}-${city}`}
              onClick={function() {
                onCitySelect(city);
              }}
              className={styles.cityButton}
            >
              {city}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FavoritesList;

