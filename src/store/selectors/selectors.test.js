import { fromJS } from 'immutable';
import {
  isAuthenticated,
  isAdmin,
  getWeatherData,
  getWeatherLoading,
  getWeatherError,
  getFavoriteCities
} from './selectors';

describe('selectors', function() {
  test('isAuthenticated возвращает правильное значение', function() {
    const state = {
      auth: {
        isAuthenticated: true,
        user: { id: 1, username: 'admin', role: 'admin' }
      }
    };
    expect(isAuthenticated(state)).toBe(true);
  });

  test('isAdmin возвращает true для администратора', function() {
    const state = {
      auth: {
        isAuthenticated: true,
        user: { id: 1, username: 'admin', role: 'admin' }
      }
    };
    expect(isAdmin(state)).toBe(true);
  });

  test('isAdmin возвращает false для обычного пользователя', function() {
    const state = {
      auth: {
        isAuthenticated: true,
        user: { id: 2, username: 'user', role: 'user' }
      }
    };
    expect(isAdmin(state)).toBe(false);
  });

  test('getWeatherData возвращает данные погоды из Immutable', function() {
    const state = {
      weather: {
        data: fromJS({ city: 'Moscow', temperature: 20 }),
        loading: false,
        error: null
      }
    };
    expect(getWeatherData(state)).toEqual({
      city: 'Moscow',
      temperature: 20
    });
  });

  test('getWeatherData возвращает обычный объект если не Immutable', function() {
    const state = {
      weather: {
        data: { city: 'Moscow', temperature: 20 },
        loading: false,
        error: null
      }
    };
    expect(getWeatherData(state)).toEqual({
      city: 'Moscow',
      temperature: 20
    });
  });

  test('getWeatherLoading возвращает состояние загрузки', function() {
    const state = {
      weather: {
        data: null,
        loading: true,
        error: null
      }
    };
    expect(getWeatherLoading(state)).toBe(true);
  });

  test('getWeatherError возвращает ошибку', function() {
    const state = {
      weather: {
        data: null,
        loading: false,
        error: 'Ошибка загрузки'
      }
    };
    expect(getWeatherError(state)).toBe('Ошибка загрузки');
  });

  test('getFavoriteCities возвращает список избранных городов', function() {
    const state = {
      favorites: {
        cities: ['Moscow', 'Saint Petersburg']
      }
    };
    expect(getFavoriteCities(state)).toEqual(['Moscow', 'Saint Petersburg']);
  });
});

