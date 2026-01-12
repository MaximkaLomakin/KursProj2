// Конвертация скорости ветра
export function convertWindSpeed(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) {
    return value;
  }

  // Конвертируем в м/с как базовую единицу
  let msValue = value;
  if (fromUnit === 'kmh') {
    msValue = value / 3.6;
  } else if (fromUnit === 'mph') {
    msValue = value / 2.237;
  }

  // Конвертируем из м/с в нужную единицу
  if (toUnit === 'ms') {
    return Math.round(msValue * 10) / 10;
  } else if (toUnit === 'kmh') {
    return Math.round(msValue * 3.6 * 10) / 10;
  } else if (toUnit === 'mph') {
    return Math.round(msValue * 2.237 * 10) / 10;
  }

  return value;
}

// Получить единицу измерения для скорости ветра
export function getWindSpeedUnit(unit) {
  switch (unit) {
    case 'ms':
      return 'м/с';
    case 'kmh':
      return 'км/ч';
    case 'mph':
      return 'миль/ч';
    default:
      return 'м/с';
  }
}

// Конвертация давления
export function convertPressure(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) {
    return value;
  }

  // Конвертируем в гПа как базовую единицу
  let hpaValue = value;
  if (fromUnit === 'mmHg') {
    hpaValue = value * 1.33322;
  } else if (fromUnit === 'inHg') {
    hpaValue = value * 33.8639;
  }

  // Конвертируем из гПа в нужную единицу
  if (toUnit === 'hpa') {
    return Math.round(hpaValue);
  } else if (toUnit === 'mmHg') {
    return Math.round(hpaValue / 1.33322);
  } else if (toUnit === 'inHg') {
    return Math.round((hpaValue / 33.8639) * 100) / 100;
  }

  return value;
}

// Получить единицу измерения для давления
export function getPressureUnit(unit) {
  switch (unit) {
    case 'hpa':
      return 'гПа';
    case 'mmHg':
      return 'мм рт.ст.';
    case 'inHg':
      return 'дюйм рт.ст.';
    default:
      return 'гПа';
  }
}

