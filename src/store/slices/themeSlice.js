import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDark: false
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: initialState,
  reducers: {
    toggleTheme: function(state) {
      state.isDark = !state.isDark;
      localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', state.isDark ? 'dark' : 'light');
    },
    setTheme: function(state, action) {
      state.isDark = action.payload === 'dark';
      localStorage.setItem('theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    loadThemeFromStorage: function(state) {
      const savedTheme = localStorage.getItem('theme') || 'light';
      state.isDark = savedTheme === 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }
});

export const { toggleTheme, setTheme, loadThemeFromStorage } = themeSlice.actions;
export default themeSlice.reducer;

