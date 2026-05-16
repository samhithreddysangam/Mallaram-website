'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, AlertTriangle, Info, Zap, Droplets, Phone, 
  ShieldAlert, Wifi, ArrowRight, Share2, CheckCircle2,
  Cloud, Sun, CloudRain, Wind, Thermometer, CloudLightning,
  Leaf, Activity, Waves
} from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n';

interface EmergencyAlertsProps {
  locale: Locale;
}

export default function EmergencyAlerts({ locale }: EmergencyAlertsProps) {
  const dictionary = getDictionary(locale);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=18.2574&longitude=79.1360&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max&timezone=auto');
        const data = await res.json();
        setWeather(data);
      } catch (e) {
        console.error('Weather fetch failed', e);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code <= 3) return Sun;
    if (code <= 48) return Cloud;
    if (code <= 67) return CloudRain;
    if (code <= 82) return CloudRain;
    if (code <= 99) return CloudLightning;
    return Cloud;
  };

  const getWeatherDescription = (code: number) => {
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
  };

  // Generate REAL alerts from weather data
  const generateAlerts = () => {
    const live: any[] = [];
    if (!weather) return live;

    const temp = weather.current.temperature_2m;
    const code = weather.current.weather_code;
    const precip = weather.current.precipitation;
    const wind = weather.current.wind_speed_10m;
    const humidity = weather.current.relative_humidity_2m;
    const todayMaxTemp = weather.daily?.temperature_2m_max?.[0];
    const todayPrecipSum = weather.daily?.precipitation_sum?.[0];
    const todayUV = weather.daily?.uv_index_max?.[0];
    const tomorrowCode = weather.daily?.weather_code?.[1];
    const tomorrowPrecip = weather.daily?.precipitation_sum?.[1];
    const tomorrowRainChance = weather.daily?.precipitation_probability_max?.[1] ?? 0;

    // Heavy rain / storm alert — only when genuinely heavy rain is happening NOW
    if (code >= 65 && precip > 0) {
      live.push({
        title: locale === 'te' ? 'భారీ వర్షం హెచ్చరిక' : 'Heavy Rain Warning',
        type: 'Critical',
        time: locale === 'te' ? 'ఇప్పుడు' : 'Now',
        desc: locale === 'te'
          ? `ప్రస్తుతం ${getWeatherDescription(code)} - ${precip}mm వర్షపాతం నమోదు. రైతులు పంటలను భద్రపరచుకోండి, పల్లపు ప్రాంతాలకు దూరంగా ఉండండి.`
          : `Currently ${getWeatherDescription(code)} — ${precip}mm precipitation recorded. Farmers should secure crops and stay away from low-lying areas.`,
        icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20'
      });
    }

    // Light rain advisory — gentle heads-up when light rain is detected
    if (code >= 51 && code < 65 && precip > 0) {
      live.push({
        title: locale === 'te' ? 'తేలికపాటి వర్షం' : 'Light Rain',
        type: 'Advisory',
        time: locale === 'te' ? 'ఇప్పుడు' : 'Now',
        desc: locale === 'te'
          ? `ప్రస్తుతం ${getWeatherDescription(code)} — ${precip}mm వర్షపాతం. గొడుగు తీసుకెళ్ళండి.`
          : `Currently ${getWeatherDescription(code)} — ${precip}mm precipitation. Carry an umbrella if heading out.`,
        icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20'
      });
    }

    // Thunderstorm alert
    if (code >= 95) {
      live.push({
        title: locale === 'te' ? 'ఉరుములతో కూడిన తుఫాను' : 'Thunderstorm Alert',
        type: 'Critical',
        time: locale === 'te' ? 'ఇప్పుడు' : 'Now',
        desc: locale === 'te'
          ? 'ఉరుములు మరియు మెరుపులతో కూడిన వర్షం. బయట ఉన్నవారు సురక్షిత ప్రదేశాలకు వెళ్ళండి. చెట్ల కింద ఆశ్రయం తీసుకోకండి.'
          : 'Thunder and lightning detected. Seek shelter indoors immediately. Do not take shelter under trees.',
        icon: CloudLightning, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20'
      });
    }

    // Extreme heat alert
    if (temp > 42 || todayMaxTemp > 44) {
      live.push({
        title: locale === 'te' ? 'అధిక ఉష్ణోగ్రత హెచ్చరిక' : 'Extreme Heat Alert',
        type: 'Critical',
        time: locale === 'te' ? 'ఇప్పుడు' : 'Now',
        desc: locale === 'te'
          ? `ఉష్ణోగ్రత ${Math.round(temp)}°C నమోదు. మధ్యాహ్నం 12–4 గంటల మధ్య బయటకు వెళ్ళడం మానుకోండి. ఎక్కువ నీరు తాగండి.`
          : `Temperature recorded at ${Math.round(temp)}°C. Avoid outdoor work between 12–4 PM. Stay hydrated and seek shade.`,
        icon: Thermometer, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20'
      });
    }

    // High UV warning
    if (todayUV > 8) {
      live.push({
        title: locale === 'te' ? 'అధిక UV హెచ్చరిక' : 'High UV Index Warning',
        type: 'Warning',
        time: locale === 'te' ? 'ఈ రోజు' : 'Today',
        desc: locale === 'te'
          ? `UV సూచిక ${todayUV} (అధికం). పొలం పనులకు వెళ్ళేటప్పుడు టోపీ, సన్ స్క్రీన్ వాడండి.`
          : `UV index is ${todayUV} (very high). Wear hats and sunscreen when working in the fields.`,
        icon: Sun, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20'
      });
    }

    // Strong wind advisory
    if (wind > 40) {
      live.push({
        title: locale === 'te' ? 'బలమైన గాలుల హెచ్చరిక' : 'Strong Wind Advisory',
        type: 'Warning',
        time: locale === 'te' ? 'ఇప్పుడు' : 'Now',
        desc: locale === 'te'
          ? `గాలి వేగం ${wind} km/h. తాటాకు / టిన్ కప్పులను భద్రపరచుకోండి.`
          : `Wind speed at ${wind} km/h. Secure thatched roofs and tin coverings.`,
        icon: Wind, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20'
      });
    }

    // Tomorrow forecast advisory — only if rain chance is significant (>40%)
    if (tomorrowCode && tomorrowCode >= 61 && tomorrowRainChance > 40) {
      live.push({
        title: locale === 'te' ? 'రేపటి వాతావరణ సూచన' : 'Tomorrow Forecast Advisory',
        type: 'Advisory',
        time: locale === 'te' ? 'రేపు' : 'Tomorrow',
        desc: locale === 'te'
          ? `రేపు ${getWeatherDescription(tomorrowCode)} అంచనా — వర్షం అవకాశం ${tomorrowRainChance}%${tomorrowPrecip ? `, ${tomorrowPrecip}mm వర్షపాతం` : ''}. పంట కోత / ఎరువుల పనులను వాయిదా వేయండి.`
          : `${getWeatherDescription(tomorrowCode)} expected tomorrow — ${tomorrowRainChance}% chance of rain${tomorrowPrecip ? `, ${tomorrowPrecip}mm expected` : ''}. Consider postponing harvesting or fertilizer application.`,
        icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20'
      });
    }

    // Good weather — all clear
    if (live.length === 0) {
      live.push({
        title: locale === 'te' ? 'వాతావరణం బాగుంది' : 'Clear Weather — All Safe',
        type: 'Info',
        time: locale === 'te' ? 'ఇప్పుడు' : 'Now',
        desc: locale === 'te'
          ? `ప్రస్తుతం ${Math.round(temp)}°C, ${getWeatherDescription(code)}. వ్యవసాయ పనులకు అనుకూలం. తేమ ${humidity}%.`
          : `Currently ${Math.round(temp)}°C, ${getWeatherDescription(code)}. Good conditions for farming. Humidity at ${humidity}%.`,
        icon: CheckCircle2, color: 'text-[#15803d]', bg: 'bg-[#15803d]/10', border: 'border-[#15803d]/20'
      });
    }

    return live;
  };

  const alerts = generateAlerts();

  // Time-aware utility statuses
  const hour = new Date().getHours();
  const waterStatus = hour >= 6 && hour < 8 ? (locale === 'te' ? 'ఇప్పుడు' : 'Active Now') : hour >= 17 && hour < 19 ? (locale === 'te' ? 'ఇప్పుడు' : 'Active Now') : hour < 6 ? (locale === 'te' ? 'తదుపరి: ఉ. 6' : 'Next: 6AM') : hour < 17 ? (locale === 'te' ? 'తదుపరి: సా. 5' : 'Next: 5PM') : (locale === 'te' ? 'తదుపరి: ఉ. 6' : 'Next: 6AM');
  const electricityStatus = hour >= 6 && hour < 22 ? (locale === 'te' ? 'సక్రియం' : 'Active') : (locale === 'te' ? 'షెడ్యూల్డ్ కట్' : 'Load Shedding');

  const statuses = [
    { label: locale === 'te' ? 'విద్యుత్' : 'Electricity', status: electricityStatus, icon: Zap, color: 'text-amber-500' },
    { label: locale === 'te' ? 'మంచినీరు' : 'Water Supply', status: waterStatus, icon: Droplets, color: 'text-blue-500' },
    { label: locale === 'te' ? 'గ్రామ వైఫై' : 'Village WiFi', status: locale === 'te' ? 'ఆన్‌లైన్' : 'Online', icon: Wifi, color: 'text-green-500' },
  ];

  return (
    <section id="alerts" className="py-32 bg-[#FAF9F6] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: Title & Utility Status */}
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-red-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                {dictionary.alerts.livePulse}
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-[#0A0A0A] mb-8 uppercase tracking-tighter leading-[0.9]">
                Weather <span className="text-red-500">&</span> Alerts
              </h2>
              <p className="text-gray-600 font-medium leading-relaxed mb-10">
                {dictionary.alerts.description}
              </p>
            </motion.div>

            {/* Weather Widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-10 p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-blue-500/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                {weather ? (
                  (() => {
                    const Icon = getWeatherIcon(weather.current.weather_code);
                    return <Icon className="w-24 h-24 text-blue-500" />;
                  })()
                ) : <Sun className="w-24 h-24 text-amber-500" />}
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{dictionary.alerts.realTimeWeather}</span>
                </div>

                <div className="flex items-end gap-2 mb-2">
                  <span className="text-6xl font-black text-[#0A0A0A] tracking-tighter">
                    {weather ? Math.round(weather.current.temperature_2m) : '--'}
                  </span>
                  <span className="text-2xl font-bold text-gray-300 mb-2">°C</span>
                </div>
                <div className="text-sm font-bold text-gray-500 mb-8">
                  {weather ? getWeatherDescription(weather.current.weather_code) : '...'}
                  {weather && weather.current.precipitation > 0 && (
                    <span className="text-blue-500"> · {weather.current.precipitation}mm rain</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-500">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{dictionary.alerts.humidity}</div>
                      <div className="text-sm font-bold text-[#0A0A0A] leading-none">{weather ? weather.current.relative_humidity_2m : '--'}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{dictionary.alerts.wind}</div>
                      <div className="text-sm font-bold text-[#0A0A0A] leading-none">{weather ? weather.current.wind_speed_10m : '--'}km/h</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Utility Status Grid */}
            <div className="grid grid-cols-1 gap-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Current Village Services</h3>
              {statuses.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-3xl bg-white border border-gray-100 flex items-center justify-between group hover:border-gray-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-gray-50 ${item.color} group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</div>
                      <div className="text-sm font-bold text-[#0A0A0A]">{item.status}</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Alert Timeline & Environment Stats */}
          <div className="lg:col-span-2 space-y-12">

            {/* Live Environment GlassStats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                  <Wind className="w-16 h-16 text-blue-500" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-500">
                      <Wind className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                      {locale === 'te' ? 'గాలి నాణ్యత (AQI)' : 'Air Quality'}
                    </span>
                  </div>
                  <div className="text-3xl font-black text-[#0A0A0A] tracking-tighter mb-1">
                    42
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15803d] animate-pulse"></span>
                    <span className="text-[10px] font-bold text-[#15803d] uppercase tracking-wider">
                      {locale === 'te' ? 'చాలా బాగుంది' : 'Good / Healthy'}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-[2rem] bg-[#0A0A0A] border border-gray-800 shadow-xl relative overflow-hidden group hover:shadow-2xl hover:shadow-[#22FF88]/10 transition-all"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                  <Leaf className="w-16 h-16 text-[#22FF88]" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-[#22FF88]/10 text-[#22FF88]">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                      {locale === 'te' ? 'నేల తేమ' : 'Soil Moisture'}
                    </span>
                  </div>
                  <div className="text-3xl font-black text-white tracking-tighter mb-1">
                    68%
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22FF88]"></span>
                    <span className="text-[10px] font-bold text-[#22FF88] uppercase tracking-wider">
                      {locale === 'te' ? 'అనుకూలం' : 'Optimal'}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                  <Waves className="w-16 h-16 text-cyan-500" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-cyan-50 text-cyan-500">
                      <Waves className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                      {locale === 'te' ? 'చెరువు నీటి మట్టం' : 'Reservoir Level'}
                    </span>
                  </div>
                  <div className="text-3xl font-black text-[#0A0A0A] tracking-tighter mb-1">
                    84%
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                    <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">
                      {locale === 'te' ? 'స్థిరంగా ఉంది' : 'Stable'}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                  <Activity className="w-16 h-16 text-amber-500" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                      {locale === 'te' ? 'పంటల ఆరోగ్యం' : 'Crop Health'}
                    </span>
                  </div>
                  <div className="text-3xl font-black text-[#0A0A0A] tracking-tighter mb-1">
                    92%
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                      {locale === 'te' ? 'తెగుళ్లు లేవు' : 'No Pests Detected'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>            {/* Alerts Timeline */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-4">{dictionary.alerts.emergencyNotifications}</h4>
            {alerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 md:p-10 rounded-[3rem] border transition-all duration-500 relative overflow-hidden group ${
                  alert.type === 'Critical' 
                    ? 'bg-white border-red-500/30 shadow-[0_20px_50px_rgba(239,68,68,0.08)]' 
                    : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
              >
                {alert.type === 'Critical' && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
                )}
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl ${alert.bg} ${alert.color}`}>
                      <alert.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          alert.type === 'Critical' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {alert.type}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{alert.time}</span>
                      </div>
                      <h4 className="text-2xl font-black tracking-tighter uppercase text-[#0A0A0A]">
                        {alert.title}
                      </h4>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed font-medium mb-10 relative z-10">
                  {alert.desc}
                </p>

                <div className="flex flex-wrap gap-4 relative z-10">
                  <button className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    alert.type === 'Critical' 
                      ? 'bg-red-500 text-white hover:bg-red-600 shadow-xl shadow-red-500/20' 
                      : 'bg-[#15803d] text-white hover:bg-[#0A0A0A] shadow-xl shadow-[#15803d]/10'
                  } active:scale-95`}>
                    <CheckCircle2 className="w-4 h-4" />
                    Got It
                  </button>
                  <button className="flex items-center gap-2 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all active:scale-95">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Subscription Module */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[3rem] bg-[#0A0A0A] text-white flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-white/10 text-white">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tighter">{dictionary.alerts.stayNotified}</h4>
                  <p className="text-gray-400 text-sm font-medium">{dictionary.alerts.subscribeDesc}</p>
                </div>
              </div>
              <button className="w-full md:w-auto px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#15803d] hover:text-white transition-all">
                {dictionary.alerts.whatsappCta}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

        {/* Emergency Contact Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-10 md:p-16 bg-red-600 rounded-[3.5rem] md:rounded-[5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl shadow-red-600/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-[2rem] md:rounded-[3rem] bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
              <Phone className="w-10 h-10 md:w-12 md:h-12 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.8] mb-3">{dictionary.emergency.title}</h3>
              <p className="text-red-100 font-bold uppercase tracking-widest text-[10px] md:text-xs opacity-80">{dictionary.emergency.available}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 w-full lg:w-auto">
            <div className="text-center md:text-right">
              <span className="block text-red-200 text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">{dictionary.emergency.services}</span>
              <span className="text-5xl md:text-7xl font-black tracking-tighter">100 / 108</span>
            </div>
            <a href="tel:108" className="w-full md:w-auto px-12 md:px-16 py-6 md:py-8 bg-white text-red-600 text-[12px] md:text-[14px] font-black uppercase tracking-[0.2em] rounded-[2rem] md:rounded-[2.5rem] hover:bg-black hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 group">
              {dictionary.emergency.callNow}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
