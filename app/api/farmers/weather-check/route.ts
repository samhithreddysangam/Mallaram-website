import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MALLARAM_LAT, MALLARAM_LON, getWeatherCondition } from '@/lib/weather';

// Weather thresholds that trigger farmer alerts
const WEATHER_THRESHOLDS = {
  heatwave: { temp: 42, label: 'Extreme Heat' },
  heavyRain: { precipMm: 20, label: 'Heavy Rain' },
  strongWind: { speed: 40, label: 'Strong Wind' },
  thunderstorm: { codeMin: 95, label: 'Thunderstorm' },
  coldWave: { temp: 10, label: 'Cold Wave' },
};

interface WeatherAlert {
  type: string;
  severity: 'high' | 'medium' | 'low';
  titleEn: string;
  titleTe: string;
  messageEn: string;
  messageTe: string;
  affectedFarmers: number;
  farmerIds: string[];
}

export async function GET() {
  try {
    // 1. Fetch current weather from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${MALLARAM_LAT}&longitude=${MALLARAM_LON}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=3`;

    const res = await fetch(weatherUrl, { next: { revalidate: 300 } });
    if (!res.ok) {
      throw new Error(`Weather API returned ${res.status}`);
    }
    const weather = await res.json();

    const currentTemp = weather.current.temperature_2m;
    const currentPrecip = weather.current.precipitation || 0;
    const weatherCode = weather.current.weather_code;
    const windSpeed = weather.current.wind_speed_10m || 0;
    const condition = getWeatherCondition(weatherCode);
    const todayMaxTemp = weather.daily?.temperature_2m_max?.[0];
    const todayMinTemp = weather.daily?.temperature_2m_min?.[0];
    const todayRainChance = weather.daily?.precipitation_probability_max?.[0] || 0;
    const tomorrowRainChance = weather.daily?.precipitation_probability_max?.[1] || 0;
    const tomorrowPrecip = weather.daily?.precipitation_sum?.[1] || 0;

    // 2. Evaluate weather conditions against thresholds
    const alerts: WeatherAlert[] = [];
    const isHeavyRain = currentPrecip >= WEATHER_THRESHOLDS.heavyRain.precipMm || (tomorrowRainChance > 60 && tomorrowPrecip > 15);
    const isHeatwave = currentTemp >= WEATHER_THRESHOLDS.heatwave.temp || (todayMaxTemp && todayMaxTemp >= 44);
    const isStrongWind = windSpeed >= WEATHER_THRESHOLDS.strongWind.speed;
    const isThunderstorm = weatherCode >= WEATHER_THRESHOLDS.thunderstorm.codeMin;
    const isColdWave = currentTemp <= WEATHER_THRESHOLDS.coldWave.temp;

    // 3. Build alert objects
    if (isHeatwave) {
      alerts.push({
        type: 'heatwave',
        severity: 'high',
        titleEn: '🌡️ Extreme Heat Warning',
        titleTe: '🌡️ అధిక ఉష్ణోగ్రత హెచ్చరిక',
        messageEn: `Temperature is ${Math.round(currentTemp)}°C. Protect your crops from heat stress — irrigate early morning or evening. Avoid working in fields between 12-4 PM.`,
        messageTe: `ఉష్ణోగ్రత ${Math.round(currentTemp)}°C. పంటలను వేడి నుండి రక్షించండి — ఉదయం లేదా సాయంత్రం నీరు పెట్టండి. మధ్యాహ్నం 12-4 గంటల మధ్య పొలంలో పని చేయకండి.`,
        affectedFarmers: 0,
        farmerIds: [],
      });
    }

    if (isHeavyRain) {
      alerts.push({
        type: 'heavyRain',
        severity: 'high',
        titleEn: '🌧️ Heavy Rain Alert',
        titleTe: '🌧️ భారీ వర్ష హెచ్చరిక',
        messageEn: `Heavy rain expected — ${Math.round(currentPrecip || tomorrowPrecip)}mm. Secure harvested crops, avoid low-lying fields, and check drainage in your farm.`,
        messageTe: `భారీ వర్షం అంచనా — ${Math.round(currentPrecip || tomorrowPrecip)}mm. కోసిన పంటలను భద్రపరచండి, పల్లపు ప్రాంతాలకు దూరంగా ఉండండి, మీ పొలంలో నీటి డ్రైనేజీ తనిఖీ చేయండి.`,
        affectedFarmers: 0,
        farmerIds: [],
      });
    }

    if (isStrongWind) {
      alerts.push({
        type: 'strongWind',
        severity: 'medium',
        titleEn: '💨 Strong Wind Advisory',
        titleTe: '💨 బలమైన గాలుల సూచన',
        messageEn: `Wind speed at ${Math.round(windSpeed)} km/h. Secure thatched roofs, tin sheets, and standing crops. Avoid spraying pesticides today.`,
        messageTe: `గాలి వేగం ${Math.round(windSpeed)} km/h. తాటాకు/టిన్ కప్పులు మరియు పంటలను భద్రపరచండి. ఈ రోజు పురుగు మందులు పిచికారీ చేయకండి.`,
        affectedFarmers: 0,
        farmerIds: [],
      });
    }

    if (isThunderstorm) {
      alerts.push({
        type: 'thunderstorm',
        severity: 'high',
        titleEn: '⛈️ Thunderstorm Alert',
        titleTe: '⛈️ ఉరుములతో కూడిన తుఫాను హెచ్చరిక',
        messageEn: `Thunderstorm detected! Seek shelter immediately. Do not stand under trees or near metal equipment in the fields.`,
        messageTe: `ఉరుములతో కూడిన తుఫాను! వెంటనే ఆశ్రయం పొందండి. చెట్ల కింద లేదా పొలంలో లోహ పరికరాల దగ్గర నిలబడకండి.`,
        affectedFarmers: 0,
        farmerIds: [],
      });
    }

    if (isColdWave) {
      alerts.push({
        type: 'coldWave',
        severity: 'medium',
        titleEn: '❄️ Cold Wave Advisory',
        titleTe: '❄️ చలి తరంగ సూచన',
        messageEn: `Temperature dropping to ${Math.round(currentTemp)}°C. Protect sensitive crops with covers. Keep livestock in shelter.`,
        messageTe: `ఉష్ణోగ్రత ${Math.round(currentTemp)}°Cకి పడిపోతోంది. సున్నితమైన పంటలను కవర్లతో రక్షించండి. పశువులను ఆశ్రయంలో ఉంచండి.`,
        affectedFarmers: 0,
        farmerIds: [],
      });
    }

    // 4. Find affected farmers (active, consented to alerts)
    if (alerts.length > 0) {
      const farmers = await prisma.farmerEnrollment.findMany({
        where: {
          active: true,
          consentAlerts: true,
        },
      });

      // For each alert, find relevant farmers based on crops/condition
      for (const alert of alerts) {
        let relevantFarmers = [...farmers];

        // Filter by crop relevance
        if (alert.type === 'heatwave' || alert.type === 'coldWave') {
          // All farmers with crops are affected by temperature extremes
          relevantFarmers = relevantFarmers.filter(f => f.crops && f.crops.length > 0);
        }
        if (alert.type === 'heavyRain' || alert.type === 'thunderstorm') {
          // Farmers with standing crops (paddy especially) are most affected
          relevantFarmers = relevantFarmers.filter(f => {
            if (!f.crops) return true;
            const crops = f.crops.toLowerCase();
            return crops.includes('paddy') || crops.includes('rice') || crops.includes('cotton');
          });
        }
        if (alert.type === 'strongWind') {
          // Farmers with tall crops or structures
          relevantFarmers = relevantFarmers.filter(f => {
            if (!f.crops) return true;
            const crops = f.crops.toLowerCase();
            return crops.includes('maize') || crops.includes('millet') || crops.includes('sorghum');
          });
        }

        alert.affectedFarmers = relevantFarmers.length;
        alert.farmerIds = relevantFarmers.map(f => f.id);
      }
    }

    // 5. Return weather summary + alerts + farmer counts
    return NextResponse.json({
      current: {
        temp: Math.round(currentTemp),
        condition,
        precipitation: currentPrecip,
        windSpeed: Math.round(windSpeed),
        humidity: weather.current.relative_humidity_2m || 0,
        todayMax: todayMaxTemp ? Math.round(todayMaxTemp) : null,
        todayMin: todayMinTemp ? Math.round(todayMinTemp) : null,
      },
      forecast: {
        today: { rainChance: todayRainChance, precip: weather.daily?.precipitation_sum?.[0] || 0 },
        tomorrow: { rainChance: tomorrowRainChance, precip: tomorrowPrecip },
      },
      alerts,
      hasActiveAlerts: alerts.length > 0,
      totalAlerts: alerts.length,
      totalAffectedFarmers: alerts.reduce((sum, a) => sum + a.affectedFarmers, 0),
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Failed to check weather for farmers:', error);
    return NextResponse.json({
      error: 'Failed to check weather',
      hasActiveAlerts: false,
      alerts: [],
      totalAffectedFarmers: 0,
    }, { status: 200 }); // Return 200 with empty data to keep UI stable
  }
}
