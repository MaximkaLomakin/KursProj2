import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import { clearFavorites } from '../../store/slices/favoritesSlice';
import { isAdmin } from '../../store/selectors/selectors';
import LoginModal from '../LoginModal/LoginModal';
import RegisterModal from '../RegisterModal/RegisterModal';
import styles from './Navigation.module.css';

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef(null);
  const isAuthenticated = useSelector(function(state) {
    return state.auth.isAuthenticated;
  });
  const user = useSelector(function(state) {
    return state.auth.user;
  });
  const userIsAdmin = useSelector(isAdmin);
  const isDark = useSelector(function(state) {
    return state.theme.isDark;
  });

  function handleLogout() {
    dispatch(logout());
    dispatch(clearFavorites());
    navigate('/');
  }

  function handleOpenLogin() {
    setLoginModalOpen(true);
    setRegisterModalOpen(false);
  }

  function handleOpenRegister() {
    setRegisterModalOpen(true);
    setLoginModalOpen(false);
  }

  function handleCloseModals() {
    setLoginModalOpen(false);
    setRegisterModalOpen(false);
  }

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  function handleMobileMenuToggle() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  function handleCloseMobileMenu() {
    setMobileMenuOpen(false);
  }

  useEffect(function() {
    function checkMobile() {
      setIsMobile(window.innerWidth <= 768);
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return function() {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(function() {
    function handleClickOutside(event) {
      if (menuRef.current && 
          !menuRef.current.contains(event.target) &&
          !event.target.closest(`.${styles.mobileMenuButton}`) &&
          mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }

    function handleResize() {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      setIsMobile(window.innerWidth <= 768);
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('resize', handleResize);
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = '';
    }

    return function() {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, styles.mobileMenuButton, isMobile]);

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={handleCloseMobileMenu}>
          <svg className={styles.logoIcon} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            <circle cx="12" cy="12" r="5" />
          </svg>
          <span className={styles.logoText}>Погода</span>
        </Link>
        <button className={styles.mobileMenuButton} onClick={handleMobileMenuToggle} aria-label="Меню">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
        <div ref={menuRef} className={`${styles.menu} ${mobileMenuOpen ? styles.menuOpen : ''} ${styles.menuDesktop}`}>
          {isAuthenticated ? (
            <>
              <Link to="/" className={styles.link} onClick={handleCloseMobileMenu}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Главная</span>
              </Link>
              {userIsAdmin && (
                <Link to="/admin" className={styles.link} onClick={handleCloseMobileMenu}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="9" y1="9" x2="21" y2="9" />
                  </svg>
                  <span>Админ панель</span>
                </Link>
              )}
              <div className={styles.user}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>{user?.username || 'Пользователь'}</span>
              </div>
              <button onClick={function() { handleLogout(); handleCloseMobileMenu(); }} className={styles.logoutButton}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Выход</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={function() { handleOpenLogin(); handleCloseMobileMenu(); }} className={styles.authButton}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                <span>Вход</span>
              </button>
              <button onClick={function() { handleOpenRegister(); handleCloseMobileMenu(); }} className={styles.authButtonPrimary}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                <span>Регистрация</span>
              </button>
            </>
          )}
          <button onClick={handleToggleTheme} className={styles.themeButton} title={isDark ? 'Светлая тема' : 'Тёмная тема'}>
            {isDark ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
        {mobileMenuOpen && isMobile && createPortal(
          <div ref={menuRef} className={`${styles.menu} ${styles.menuOpen}`}>
            <button className={styles.closeButton} onClick={handleCloseMobileMenu} aria-label="Закрыть меню">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/" className={styles.link} onClick={handleCloseMobileMenu}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Главная</span>
                </Link>
                {userIsAdmin && (
                  <Link to="/admin" className={styles.link} onClick={handleCloseMobileMenu}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="9" y1="3" x2="9" y2="21" />
                      <line x1="9" y1="9" x2="21" y2="9" />
                    </svg>
                    <span>Админ панель</span>
                  </Link>
                )}
                <div className={styles.user}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>{user?.username || 'Пользователь'}</span>
                </div>
                <button onClick={function() { handleLogout(); handleCloseMobileMenu(); }} className={styles.logoutButton}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Выход</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={function() { handleOpenLogin(); handleCloseMobileMenu(); }} className={styles.authButton}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  <span>Вход</span>
                </button>
                <button onClick={function() { handleOpenRegister(); handleCloseMobileMenu(); }} className={styles.authButtonPrimary}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  <span>Регистрация</span>
                </button>
              </>
            )}
            <button onClick={handleToggleTheme} className={styles.themeButton} title={isDark ? 'Светлая тема' : 'Тёмная тема'}>
              {isDark ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>,
          document.body
        )}
      </div>
      <LoginModal
        isOpen={loginModalOpen}
        onClose={handleCloseModals}
        onSwitchToRegister={handleOpenRegister}
      />
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={handleCloseModals}
        onSwitchToLogin={handleOpenLogin}
      />
    </nav>
  );
}

export default Navigation;

