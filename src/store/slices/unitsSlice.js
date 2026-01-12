import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  windSpeed: 'ms', // ms, kmh, mph
  pressure: 'hpa' // hpa, mmHg, inHg
};

const unitsSlice = createSlice({
  name: 'units',
  initialState: initialState,
  reducers: {
    setWindSpeedUnit: function(state, action) {
      state.windSpeed = action.payload;
      localStorage.setItem('windSpeedUnit', action.payload);
    },
    setPressureUnit: function(state, action) {
      state.pressure = action.payload;
      localStorage.setItem('pressureUnit', action.payload);
    },
    loadUnitsFromStorage: function(state) {
      const savedWindSpeed = localStorage.getItem('windSpeedUnit');
      const savedPressure = localStorage.getItem('pressureUnit');
      if (savedWindSpeed) {
        state.windSpeed = savedWindSpeed;
      }
      if (savedPressure) {
        state.pressure = savedPressure;
      }
    }
  }
});

export const { setWindSpeedUnit, setPressureUnit, loadUnitsFromStorage } = unitsSlice.actions;
export default unitsSlice.reducer;

