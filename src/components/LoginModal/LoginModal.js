import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/slices/authSlice';
import styles from './LoginModal.module.css';

function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        dispatch(clearError());
      }
    },
    [isOpen, dispatch]
  );

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(login({ username, password }));
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
        <h1 className={styles.title}>Вход</h1>
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
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>
        <p className={styles.link}>
          Нет аккаунта?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className={styles.linkButton}
          >
            Зарегистрироваться
          </button>
        </p>
      </div>
    </div>,
    document.body
  );
}

export default LoginModal;

