import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../store/slices/authSlice';
import styles from './RegisterModal.module.css';

function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const loading = useSelector(function(state) {
    return state.auth.loading;
  });
  const error = useSelector(function(state) {
    return state.auth.error;
  });
  const isAuthenticated = useSelector(function(state) {
    return state.auth.isAuthenticated;
  });

  useEffect(
    function() {
      if (isAuthenticated) {
        onClose();
        setUsername('');
        setPassword('');
        setName('');
        setEmail('');
      }
      return function() {
        dispatch(clearError());
      };
    },
    [isAuthenticated, onClose, dispatch]
  );

  useEffect(
    function() {
      if (!isOpen) {
        setUsername('');
        setPassword('');
        setName('');
        setEmail('');
        dispatch(clearError());
      }
    },
    [isOpen, dispatch]
  );

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(register({ username, password, name, email }));
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h1 className={styles.title}>Регистрация</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              Логин:
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={function(e) {
                setUsername(e.target.value);
              }}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Пароль:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={function(e) {
                setPassword(e.target.value);
              }}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Имя:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={function(e) {
                setName(e.target.value);
              }}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={function(e) {
                setEmail(e.target.value);
              }}
              className={styles.input}
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className={styles.link}>
          Уже есть аккаунт?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className={styles.linkButton}
          >
            Войти
          </button>
        </p>
      </div>
    </div>,
    document.body
  );
}

export default RegisterModal;

