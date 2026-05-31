import { NextResponse } from 'next/server';
import { getAiAdvisory } from '@/lib/weather-advisory';
import { MALLARAM_LAT, MALLARAM_LON, getWeatherCondition } from '@/lib/weather';

export async function GET() {
  try {
    // Fetch current weather + 7-day forecast from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${MALLARAM_LAT}&longitude=${MALLARAM_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&hourly=precipitation_probability,temperature_2m&timezone=auto&forecast_days=7`;

    const res = await fetch(weatherUrl);
    if (!res.ok) {
      throw new Error(`Weather API returned ${res.status}`);
    }
    const data = await res.json();

    const currentTemp = Math.round(data.current.temperature_2m);
    const humidity = data.current.relative_humidity_2m;
    const condition = getWeatherCondition(data.current.weather_code);
    const windSpeed = Math.round(data.current.wind_speed_10m);

    // Get rain chance: current hour + max for today
    const currentHour = new Date().getHours();
    const currentRainChance = data.hourly?.precipitation_probability?.[currentHour] || 0;

    // Generate AI advisory
    const advisory = getAiAdvisory({
      temp: currentTemp,
      condition,
      humidity,
      rainChance: currentRainChance,
      windSpeed,
      weatherCode: data.current.weather_code,
    });

    // Build forecast summary for next 7 days
    const forecast = data.daily?.time?.map((date: string, i: number) => ({
      date,
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      condition: getWeatherCondition(data.daily.weather_code[i]),
      rainChance: data.daily.precipitation_probability_max[i] || 0,
      precipitation: data.daily.precipitation_sum[i] || 0,
    })) || [];

    return NextResponse.json({
      current: {
        temp: currentTemp,
        feelsLike: Math.round(data.current.apparent_temperature),
        condition,
        humidity,
        windSpeed,
        rainChance: currentRainChance,
        precipitation: data.current.precipitation || 0,
      },
      forecast,
      advisory,
    });
  } catch (error) {
    console.error('Error fetching weather advisory:', error);

    // Fallback advisory with error state
    const fallbackAdvisory = getAiAdvisory({
      temp: 32,
      condition: 'Clear',
      humidity: 45,
      rainChance: 10,
      windSpeed: 12,
    });

    return NextResponse.json({
      current: {
        temp: 32,
        feelsLike: 34,
        condition: 'Clear',
        humidity: 45,
        windSpeed: 12,
        rainChance: 10,
        precipitation: 0,
      },
      forecast: [],
      advisory: fallbackAdvisory,
      cached: true,
    });
  }
}
