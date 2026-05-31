import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MALLARAM_LAT, MALLARAM_LON, getWeatherCondition } from '@/lib/weather';

export async function GET() {
  try {
    // 1. Fetch from Open-Meteo (Free, No Key Required)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${MALLARAM_LAT}&longitude=${MALLARAM_LON}&current=temperature_2m,relative_humidity_2m,weather_code&hourly=precipitation_probability&timezone=auto&forecast_days=1`;
    
    const res = await fetch(weatherUrl);
    const data = await res.json();
    
    // 2. Fetch active alerts from DB
    const activeAlerts = await prisma.weatherAlert.findMany({
      where: {
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });

    const weather = {
      temp: Math.round(data.current.temperature_2m),
      condition: getWeatherCondition(data.current.weather_code),
      humidity: data.current.relative_humidity_2m,
      rainChance: data.hourly.precipitation_probability[new Date().getHours()] || 0,
      location: 'Mallaram, Telangana',
      alerts: activeAlerts
    };

    return NextResponse.json(weather);
  } catch (error) {
    console.error('Error fetching weather:', error);
    // Fallback to mock data if API fails to keep UI stable
    return NextResponse.json({ 
      temp: 32, 
      condition: 'Sunny', 
      humidity: 45, 
      rainChance: 10, 
      location: 'Mallaram (Cache)',
      alerts: [] 
    });
  }
}
