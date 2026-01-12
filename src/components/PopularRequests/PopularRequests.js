import React from 'react';
import styles from './PopularRequests.module.css';

function PopularRequests({ requests, onReset }) {
  if (!requests || requests.length === 0) {
    return <div className={styles.empty}>Запросы не найдены</div>;
  }

  function handleReset(city) {
    if (window.confirm(city ? `Обнулить запросы для города "${city}"?` : 'Обнулить все популярные запросы?')) {
      onReset(city);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Популярные запросы погоды</h2>
        <button onClick={function() { handleReset(null); }} className={styles.resetAllButton}>
          Обнулить все
        </button>
      </div>
      <div className={styles.list}>
        {requests.map(function(request, index) {
          return (
            <div key={index} className={styles.item}>
              <div className={styles.city}>{request.city}</div>
              <div className={styles.rightSection}>
                <div className={styles.count}>{request.count} запросов</div>
                <button
                  onClick={function() {
                    handleReset(request.city);
                  }}
                  className={styles.resetButton}
                  title="Обнулить запросы для этого города"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PopularRequests;

