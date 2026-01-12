import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './store/slices/authSlice';
import { loadUnitsFromStorage } from './store/slices/unitsSlice';
import { loadThemeFromStorage } from './store/slices/themeSlice';
import HomePage from './pages/HomePage/HomePage';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import styles from './App.module.css';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(function(state) {
    return state.auth.isAuthenticated;
  });

  const role = useSelector(function(state) {
    return state.auth.user?.role;
  });

  useEffect(
    function() {
      // Проверка токена при загрузке приложения
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Простая проверка токена (в реальном проекте использовать jwt-decode)
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.exp * 1000 > Date.now()) {
              dispatch(
                setUser({
                  id: payload.id,
                  username: payload.username,
                  role: payload.role
                })
              );
            } else {
              localStorage.removeItem('token');
            }
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      // Загрузка единиц измерения из хранилища
      dispatch(loadUnitsFromStorage());
      // Загрузка темы из хранилища
      dispatch(loadThemeFromStorage());
    },
    [dispatch]
  );

  return (
    <div className={styles.app}>
      <Navigation />
      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin"
            element={
              isAuthenticated && role === 'admin' ? (
                <AdminPanel />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
