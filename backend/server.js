const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Файлы для хранения данных
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'popularRequests.json');
const FAVORITES_FILE = path.join(DATA_DIR, 'favorites.json');

// Переменные для хранения данных
let users = [];
let popularRequests = {};
let favoriteCities = {};

// Создание директории для данных, если её нет
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Загрузка данных из JSON файлов
async function loadData() {
  try {
    await ensureDataDir();
    
    // Загрузка пользователей
    try {
      const usersData = await fs.readFile(USERS_FILE, 'utf8');
      users = JSON.parse(usersData);
    } catch (error) {
      users = [];
    }
    
    // Загрузка популярных запросов
    try {
      const requestsData = await fs.readFile(REQUESTS_FILE, 'utf8');
      popularRequests = JSON.parse(requestsData);
    } catch (error) {
      popularRequests = {};
    }
    
    // Загрузка избранного
    try {
      const favoritesData = await fs.readFile(FAVORITES_FILE, 'utf8');
      favoriteCities = JSON.parse(favoritesData);
    } catch (error) {
      favoriteCities = {};
    }
    
    console.log('Data loaded from JSON files');
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Сохранение данных в JSON файлы
async function saveUsers() {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

async function saveRequests() {
  try {
    await fs.writeFile(REQUESTS_FILE, JSON.stringify(popularRequests, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving requests:', error);
  }
}

async function saveFavorites() {
  try {
    await fs.writeFile(FAVORITES_FILE, JSON.stringify(favoriteCities, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
}

// Секретный ключ для JWT
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware для проверки токена
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
}

// Middleware для проверки прав администратора
function verifyAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Доступ запрещен' });
  }
}

function getCityByIP(ip) {
  return 'Минск';
}

// Регистрация
app.post('/api/register', async function(req, res) {
  try {
    const { username, password, name, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Логин и пароль обязательны' });
    }
    
    const existingUser = users.find(function(u) {
      return u.username === username;
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const maxId = users.length > 0 ? Math.max(...users.map(function(u) { return u.id; })) : 0;
    const newUser = {
      id: maxId + 1,
      username: username,
      password: hashedPassword,
      name: name || '',
      email: email || '',
      role: 'user',
      registrationDate: new Date().toISOString()
    };
    
    users.push(newUser);
    await saveUsers();
    
    const token = jwt.sign(
      { id: newUser.id, username: username, role: 'user' },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      token: token,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Вход
app.post('/api/login', async function(req, res) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Логин и пароль обязательны' });
    }
    
    const user = users.find(function(u) {
      return u.username === username;
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }
    
    const passwordValid = await bcrypt.compare(password, user.password);
    
    if (!passwordValid) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    res.json({
      token: token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение погоды (авторизация не обязательна)
app.get('/api/weather', async function(req, res) {
  try {
    const city = req.query.city || getCityByIP(req.ip);
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API ключ не настроен' });
    }
    
    // Увеличиваем счётчик популярных запросов
    popularRequests[city] = (popularRequests[city] || 0) + 1;
    await saveRequests();
    
    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ru`)
    ]);
    
    const currentData = currentResponse.data;
    const forecastData = forecastResponse.data;
    
    // Обработка почасового прогноза (ближайшие 24 часа)
    const hourlyForecast = forecastData.list.slice(0, 8).map(function(item) {
      const date = new Date(item.dt * 1000);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const timeString = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
      
      return {
        time: timeString,
        temperature: Math.round(item.main.temp),
        icon: item.weather[0].main,
        description: item.weather[0].description,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 10) / 10,
        pressure: item.main.pressure,
        feelsLike: Math.round(item.main.feels_like)
      };
    });
    
    // Обработка прогноза на дни (группировка по дням с периодами утро/день/вечер/ночь)
    // Добавляем текущую погоду как первый день
    const today = new Date();
    const todayKey = today.toDateString();
    const currentHours = today.getHours();
    
    const dailyForecastMap = {};
    
    // Инициализация сегодняшнего дня текущей погодой
    dailyForecastMap[todayKey] = {
      date: today,
      dateString: today.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }),
      morning: null,
      day: null,
      evening: null,
      night: null,
      morningHours: null,
      dayHours: null,
      eveningHours: null,
      nightHours: null
    };
    
    // Добавление текущей погоды в соответствующий период
    const currentPeriodData = {
      time: today.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      temperature: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      icon: currentData.weather[0].main,
      description: currentData.weather[0].description,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 10) / 10,
      pressure: currentData.main.pressure
    };
    
    if (currentHours >= 6 && currentHours < 12) {
      dailyForecastMap[todayKey].morning = currentPeriodData;
      dailyForecastMap[todayKey].morningHours = currentHours;
    } else if (currentHours >= 12 && currentHours < 18) {
      dailyForecastMap[todayKey].day = currentPeriodData;
      dailyForecastMap[todayKey].dayHours = currentHours;
    } else if (currentHours >= 18 && currentHours < 24) {
      dailyForecastMap[todayKey].evening = currentPeriodData;
      dailyForecastMap[todayKey].eveningHours = currentHours;
    } else {
      dailyForecastMap[todayKey].night = currentPeriodData;
      dailyForecastMap[todayKey].nightHours = currentHours;
    }
    
    forecastData.list.forEach(function(item) {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      const hours = date.getHours();
      
      if (!dailyForecastMap[dateKey]) {
        dailyForecastMap[dateKey] = {
          date: date,
          dateString: date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }),
          morning: null,
          day: null,
          evening: null,
          night: null,
          morningHours: null,
          dayHours: null,
          eveningHours: null,
          nightHours: null
        };
      }
      
      // Определяем период дня и выбираем наиболее репрезентативное время
      let period = null;
      let targetHour = null;
      
      if (hours >= 6 && hours < 12) {
        period = 'morning';
        targetHour = 9;
      } else if (hours >= 12 && hours < 18) {
        period = 'day';
        targetHour = 15; 
      } else if (hours >= 18 && hours < 24) {
        period = 'evening';
        targetHour = 21; 
      } else {
        period = 'night';
        targetHour = 3; 
      }
      
      // Сохраняем данные для периода, выбирая наиболее близкое к целевому времени
      // Если периода еще нет, сохраняем первое доступное значение
      const currentHoursKey = period + 'Hours';
      const currentHours = dailyForecastMap[dateKey][currentHoursKey];
      
      const periodData = {
        time: date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        temperature: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        icon: item.weather[0].main,
        description: item.weather[0].description,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 10) / 10,
        pressure: item.main.pressure
      };
      
      if (currentHours === null || currentHours === undefined) {
        // Если периода еще нет, сохраняем первое доступное значение
        dailyForecastMap[dateKey][period] = periodData;
        dailyForecastMap[dateKey][currentHoursKey] = hours;
      } else if (Math.abs(hours - targetHour) < Math.abs(currentHours - targetHour)) {
        // Если есть более близкое к целевому времени значение, обновляем
        dailyForecastMap[dateKey][period] = periodData;
        dailyForecastMap[dateKey][currentHoursKey] = hours;
      }
      
      // Дополнительно: если для дня нет утра/дня/вечера, но есть близкие данные, используем их
      // Это помогает заполнить пробелы для последних дней прогноза
      if (hours >= 5 && hours < 13 && !dailyForecastMap[dateKey].morning) {
        dailyForecastMap[dateKey].morning = periodData;
        dailyForecastMap[dateKey].morningHours = hours;
      }
      if (hours >= 11 && hours < 19 && !dailyForecastMap[dateKey].day) {
        dailyForecastMap[dateKey].day = periodData;
        dailyForecastMap[dateKey].dayHours = hours;
      }
      if (hours >= 17 && hours < 23 && !dailyForecastMap[dateKey].evening) {
        dailyForecastMap[dateKey].evening = periodData;
        dailyForecastMap[dateKey].eveningHours = hours;
      }
      if ((hours >= 0 && hours < 6) || (hours >= 23)) {
        if (!dailyForecastMap[dateKey].night) {
          dailyForecastMap[dateKey].night = periodData;
          dailyForecastMap[dateKey].nightHours = hours;
        }
      }
    });
    
    // Сортируем дни по дате
    const sortedDays = Object.values(dailyForecastMap).sort(function(a, b) {
      return a.date - b.date;
    });
    
    sortedDays.forEach(function(day, index) {
      if (!day.morning && day.day) {
        day.morning = day.day;
      }
      if (!day.day) {
        if (day.morning) {
          day.day = day.morning;
        } else if (day.evening) {
          day.day = day.evening;
        }
      }
      if (!day.evening) {
        if (day.day) {
          day.evening = day.day;
        } else if (day.night) {
          day.evening = day.night;
        }
      }
      if (!day.night && day.evening) {
        day.night = day.evening;
      }
    });
    
    const dailyForecast = sortedDays
      .slice(0, 5)
      .map(function(day) {
        return {
          dateString: day.dateString,
          morning: day.morning,
          day: day.day,
          evening: day.evening,
          night: day.night
        };
      });
    
    res.json({
      city: currentData.name,
      temperature: Math.round(currentData.main.temp),
      description: currentData.weather[0].description,
      humidity: currentData.main.humidity,
      windSpeed: currentData.wind.speed,
      pressure: currentData.main.pressure,
      icon: currentData.weather[0].main,
      hourlyForecast: hourlyForecast,
      dailyForecast: dailyForecast
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'Город не найден' });
    } else {
      res.status(500).json({ error: 'Ошибка получения данных о погоде' });
    }
  }
});

// Получение избранных городов
app.get('/api/favorites', verifyToken, function(req, res) {
  const userId = req.user.id;
  const favorites = favoriteCities[userId] || [];
  res.json({ cities: favorites });
});

// Добавление города в избранное
app.post('/api/favorites', verifyToken, async function(req, res) {
  const userId = req.user.id;
  const city = req.body.city;
  
  if (!city) {
    return res.status(400).json({ error: 'Город обязателен' });
  }
  
  if (!favoriteCities[userId]) {
    favoriteCities[userId] = [];
  }
  
  if (!favoriteCities[userId].includes(city)) {
    favoriteCities[userId].push(city);
    await saveFavorites();
  }
  
  res.json({ cities: favoriteCities[userId] });
});

// Удаление города из избранного
app.delete('/api/favorites', verifyToken, async function(req, res) {
  const userId = req.user.id;
  const city = req.body.city;
  
  if (!favoriteCities[userId]) {
    favoriteCities[userId] = [];
  }
  
  favoriteCities[userId] = favoriteCities[userId].filter(function(c) {
    return c !== city;
  });
  
  await saveFavorites();
  res.json({ cities: favoriteCities[userId] });
});

// Админ: получение всех пользователей
app.get('/api/admin/users', verifyToken, verifyAdmin, function(req, res) {
  const userList = users.map(function(u) {
    return {
      id: u.id,
      username: u.username,
      name: u.name,
      email: u.email,
      role: u.role,
      registrationDate: u.registrationDate
    };
  });
  
  res.json({ users: userList });
});

// Админ: обновление пользователя
app.put('/api/admin/users/:id', verifyToken, verifyAdmin, async function(req, res) {
  const userId = parseInt(req.params.id);
  const { name, email, role, password } = req.body;
  
  const user = users.find(function(u) {
    return u.id === userId;
  });
  
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (role !== undefined) user.role = role;
  if (password !== undefined && password.trim() !== '') {
    // Хэшируем новый пароль
    user.password = await bcrypt.hash(password, 10);
  }
  
  await saveUsers();
  
  res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

// Админ: удаление пользователя
app.delete('/api/admin/users/:id', verifyToken, verifyAdmin, async function(req, res) {
  const userId = parseInt(req.params.id);
  
  const userIndex = users.findIndex(function(u) {
    return u.id === userId;
  });
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  
  // Нельзя удалить самого себя
  if (req.user.id === userId) {
    return res.status(400).json({ error: 'Нельзя удалить самого себя' });
  }
  
  // Удаляем избранные города пользователя
  delete favoriteCities[userId];
  await saveFavorites();
  
  // Удаляем пользователя
  users.splice(userIndex, 1);
  await saveUsers();
  
  res.json({ message: 'Пользователь удален' });
});

// Админ: получение популярных запросов
app.get('/api/admin/popular-requests', verifyToken, verifyAdmin, function(req, res) {
  const list = Object.keys(popularRequests).map(function(city) {
    return {
      city: city,
      count: popularRequests[city]
    };
  }).sort(function(a, b) {
    return b.count - a.count;
  });
  
  res.json({ requests: list });
});

// Админ: обнуление популярных запросов
app.delete('/api/admin/popular-requests', verifyToken, verifyAdmin, async function(req, res) {
  const city = req.query.city;
  
  if (city) {
    // Обнуляем конкретный город
    if (popularRequests[city]) {
      delete popularRequests[city];
    }
  } else {
    // Обнуляем все запросы
    popularRequests = {};
  }
  
  await saveRequests();
  res.json({ message: city ? 'Запрос обнулен' : 'Все запросы обнулены' });
});

// Админ: получение статистики
app.get('/api/admin/statistics', verifyToken, verifyAdmin, function(req, res) {
  const totalUsers = users.length;
  const totalRequests = Object.values(popularRequests).reduce(function(sum, count) {
    return sum + count;
  }, 0);
  
  res.json({
    totalUsers: totalUsers,
    totalRequests: totalRequests
  });
});

// Создание администратора по умолчанию
async function createDefaultAdmin() {
  const adminExists = users.some(function(u) {
    return u.role === 'admin';
  });
  
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const maxId = users.length > 0 ? Math.max(...users.map(function(u) { return u.id; })) : 0;
    users.push({
      id: maxId + 1,
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator',
      email: 'admin@example.com',
      role: 'admin',
      registrationDate: new Date().toISOString()
    });
    await saveUsers();
    console.log('Admin created: username=admin, password=admin123');
  }
}

app.listen(PORT, async function() {
  await loadData();
  await createDefaultAdmin();
  console.log(`Server running on port ${PORT}`);
});
