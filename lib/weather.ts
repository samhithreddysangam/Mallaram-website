// Shared weather utilities for consistent data across the app

export const MALLARAM_LAT = 18.3962;
export const MALLARAM_LON = 78.8242;

export function getWeatherCondition(code: number): string {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly Cloudy';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 56 && code <= 57) return 'Freezing Drizzle';
  if (code >= 61 && code <= 65) return 'Rainy';
  if (code >= 66 && code <= 67) return 'Freezing Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 85 && code <= 86) return 'Snow Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Cloudy';
}

// WMO Weather Code descriptions for display
export function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Fog';
  if (code <= 55) return 'Drizzle';
  if (code <= 57) return 'Freezing drizzle';
  if (code <= 65) return 'Rain';
  if (code <= 67) return 'Freezing rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

// Get weather icon name for Lucide icons
export function getWeatherIconName(code: number): string {
  if (code <= 3) return 'Sun';
  if (code <= 48) return 'Cloud';
  if (code <= 67) return 'CloudRain';
  if (code <= 82) return 'CloudRain';
  if (code <= 99) return 'CloudLightning';
  return 'Cloud';
}
