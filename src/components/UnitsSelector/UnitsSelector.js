import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setWindSpeedUnit, setPressureUnit } from '../../store/slices/unitsSlice';
import styles from './UnitsSelector.module.css';

function UnitsSelector() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const windSpeedUnit = useSelector(function(state) {
    return state.units.windSpeed;
  });
  const pressureUnit = useSelector(function(state) {
    return state.units.pressure;
  });

  useEffect(
    function() {
      function handleClickOutside(event) {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return function() {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    },
    [isOpen]
  );

  function handleWindSpeedChange(event) {
    dispatch(setWindSpeedUnit(event.target.value));
  }

  function handlePressureChange(event) {
    dispatch(setPressureUnit(event.target.value));
  }

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <button onClick={toggleDropdown} className={styles.toggleButton}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
        </svg>
      </button>
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownItem}>
            <label className={styles.label}>Скорость ветра:</label>
            <select value={windSpeedUnit} onChange={handleWindSpeedChange} className={styles.select}>
              <option value="ms">м/с</option>
              <option value="kmh">км/ч</option>
              <option value="mph">миль/ч</option>
            </select>
          </div>
          <div className={styles.dropdownItem}>
            <label className={styles.label}>Давление:</label>
            <select value={pressureUnit} onChange={handlePressureChange} className={styles.select}>
              <option value="hpa">гПа</option>
              <option value="mmHg">мм рт.ст.</option>
              <option value="inHg">дюйм рт.ст.</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default UnitsSelector;

