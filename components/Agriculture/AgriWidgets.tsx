'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, TrendingUp, TrendingDown, Info } from 'lucide-react';

export function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setWeather(data);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="animate-pulse bg-white/50 h-40 rounded-3xl" />;

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Decorative sun/cloud icon in background */}
      <Sun className="absolute -top-4 -right-4 w-32 h-32 opacity-20" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-blue-100 font-medium">Weather Forecast</h3>
            <div className="text-4xl font-bold">{weather?.temp || '--'}°C</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{weather?.condition || 'No Data'}</div>
            <div className="text-blue-100 text-sm">{weather?.location || '---'}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
          <div>
            <div className="text-blue-100 text-xs uppercase tracking-wider mb-1">Humidity</div>
            <div className="font-bold">{weather?.humidity || '0'}%</div>
          </div>
          <div>
            <div className="text-blue-100 text-xs uppercase tracking-wider mb-1">Rain Chance</div>
            <div className="font-bold">{weather?.rainChance || '0'}%</div>
          </div>
        </div>

        {weather?.alerts && weather.alerts.length > 0 && (
          <div className="mt-4 p-3 bg-red-500/30 backdrop-blur-md rounded-xl border border-red-400/30 flex items-center gap-2">
            <Info className="w-5 h-5 text-red-100" />
            <span className="text-xs font-bold text-red-50 uppercase tracking-tighter">Rain Alert Active</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function MarketPrices() {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/market-prices')
      .then(res => res.json())
      .then(data => {
        setPrices(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="animate-pulse bg-white/50 h-60 rounded-3xl" />;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-primary/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
          <TrendingUp className="text-earth" />
          Market Prices
        </h3>
        <span className="text-[10px] text-earth uppercase tracking-widest font-bold">Today</span>
      </div>

      <div className="space-y-4">
        {prices.map((crop, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-cream-light border border-cream transition-hover hover:border-primary/20 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-dark shadow-sm border border-primary/5 font-bold group-hover:scale-110 transition-transform">
                {crop.cropName[0]}
              </div>
              <div>
                <div className="font-bold text-primary-dark text-sm">{crop.cropName}</div>
                <div className="text-[10px] text-earth uppercase tracking-tighter">Sircilla Market</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-primary text-base">₹{crop.price}</div>
              <div className="text-[10px] text-green-600 font-bold flex items-center justify-end gap-1">
                <TrendingUp className="w-3 h-3" />
                +2.4%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
