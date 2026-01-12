import React from 'react';
import styles from './Loading.module.css';

// Простой компонент загрузки (можно использовать как сторонний компонент)
function Loading({ text = 'Загрузка...' }) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <div className={styles.text}>{text}</div>
    </div>
  );
}

export default Loading;

