'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, BrainCircuit, Leaf, Droplets, Sun, Cloud, AlertTriangle, Lightbulb, Wind, ChevronRight, Sparkles, CalendarDays, ArrowRight } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n';

interface SmartAgricultureProps {
  locale: Locale;
}

const advisoryIconMap: Record<string, React.ElementType> = {
  '🌱': Leaf, '☀️': Sun, '🌧️': Droplets, '💧': Droplets,
  '💨': Wind, '🌡️': Thermometer, '🧪': Lightbulb, '🐛': AlertTriangle,
  '✅': Leaf, '📋': Lightbulb, '🌾': Leaf, '🌦️': Cloud, '⚠️': AlertTriangle,
};

const urgencyColors = {
  high: { border: 'border-red-500/30', bg: 'bg-red-500/5', dot: 'bg-red-500', text: 'text-red-500' },
  medium: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', dot: 'bg-amber-500', text: 'text-amber-500' },
  low: { border: 'border-[#15803d]/20', bg: 'bg-[#15803d]/5', dot: 'bg-[#15803d]', text: 'text-[#15803d]' },
};

export default function SmartAgriculture({ locale }: SmartAgricultureProps) {
  const dictionary = getDictionary(locale);
  const [advisoryData, setAdvisoryData] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedAdvisory, setExpandedAdvisory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/weather/advisory');
        const data = await res.json();
        setAdvisoryData(data.advisory);
        setWeather(data.current);
      } catch (e) {
        console.error('Failed to fetch advisory data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const marketPrices = [
    { crop: 'Paddy', price: '₹2,183/q', trend: 'up' as const },
    { crop: 'Cotton', price: '₹7,020/q', trend: 'down' as const },
    { crop: 'Maize', price: '₹1,962/q', trend: 'up' as const },
    { crop: 'Chilli', price: '₹18,500/q', trend: 'stable' as const },
  ];

  const primaryAdvisory = advisoryData?.primary;
  const secondaryAdvisories = advisoryData?.secondary || [];
  const allAdvisories = primaryAdvisory ? [primaryAdvisory, ...secondaryAdvisories] : [];

  return (
    <section id="agriculture" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left: AI Advisory Feed */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-[#15803d]/20">
              {locale === 'te' ? 'రైతులకు సహాయం' : 'Farming Help'}
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-[#0A0A0A] mb-10 tracking-tighter uppercase leading-[0.9]">
              {locale === 'te' ? 'స్మార్ట్' : 'Smart'} <br /><span className="text-[#15803d]">{locale === 'te' ? 'వ్యవసాయం' : 'Farming'}</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed font-medium">
              {locale === 'te'
                ? 'మల్లారం రైతులకు రోజువారీ మార్కెట్ ధరలు, AI వ్యవసాయ సలహాలు మరియు వాతావరణ అప్డేట్లతో సహాయం.'
                : 'Helping Mallaram farmers with daily market prices, AI-powered farming advisories, and weather updates.'}
            </p>

            {/* Live Weather Summary */}
            {weather && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8 p-6 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-blue-700 text-white relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-blue-200" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-blue-200">AI Weather Analysis</span>
                    </div>
                    {advisoryData?.season && (
                      <span className="text-[9px] font-bold text-blue-200 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
                        {locale === 'te' ? advisoryData.seasonTe : advisoryData.season}
                      </span>
                    )}
                  </div>
                  <div className="flex items-end gap-3">
                    <div>
                      <div className="text-5xl font-black tracking-tighter">{weather.temp}°</div>
                      <div className="text-sm text-blue-100 font-medium mt-1">{weather.condition}</div>
                    </div>
                    <div className="ml-auto text-right space-y-1">
                      <div className="flex items-center gap-2 text-sm text-blue-100">
                        <Droplets className="w-3.5 h-3.5" />
                        {weather.humidity}%
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-100">
                        <Wind className="w-3.5 h-3.5" />
                        {weather.windSpeed} km/h
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI Advisory Cards */}
            <div className="space-y-4">
              {loading ? (
                <>
                  <div className="animate-pulse p-8 rounded-[2.5rem] bg-gray-50 h-24" />
                  <div className="animate-pulse p-8 rounded-[2.5rem] bg-gray-50 h-20" />
                </>
              ) : (
                allAdvisories.map((advisory: any, i: number) => {
                  const Icon = advisoryIconMap[advisory.icon] || Leaf;
                  const colors = urgencyColors[advisory.urgency as keyof typeof urgencyColors] || urgencyColors.low;
                  const isExpanded = expandedAdvisory === advisory.id;

                  return (
                    <motion.div
                      key={advisory.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <button
                        onClick={() => setExpandedAdvisory(isExpanded ? null : advisory.id)}
                        className={`w-full text-left p-8 rounded-[2.5rem] border bg-white transition-all duration-300 hover:shadow-lg ${isExpanded ? `shadow-lg ${colors.border}` : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 flex-1">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${i === 0 ? 'bg-[#15803d] text-white' : 'bg-gray-100 text-gray-600'}`}>
                              <Icon className="w-7 h-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                {i === 0 && (
                                  <span className="px-2 py-0.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[8px] font-black uppercase tracking-widest">
                                    {locale === 'te' ? 'AI సూచన' : 'AI RECOMMENDED'}
                                  </span>
                                )}
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${colors.bg} ${colors.text}`}>
                                  {advisory.urgency}
                                </span>
                              </div>
                              <h4 className="text-lg font-black text-[#0A0A0A] tracking-tighter leading-tight">
                                {locale === 'te' ? advisory.titleTe : advisory.title}
                              </h4>
                            </div>
                          </div>
                          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-4 ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-gray-600 leading-relaxed font-medium">
                                  {locale === 'te' ? advisory.descriptionTe : advisory.description}
                                </p>
                                <div className="mt-4 flex items-center gap-3">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-[#15803d] bg-[#15803d]/5 px-4 py-2 rounded-xl">
                                    {locale === 'te' ? advisory.actionTe : advisory.action}
                                  </span>
                                  {advisory.urgency === 'high' && (
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                      {locale === 'te' ? 'తక్షణం' : 'Act Now'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Season Info */}
            {advisoryData?.season && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 p-6 rounded-[2.5rem] bg-[#FAF9F6] border border-gray-100 flex items-center gap-4"
              >
                <CalendarDays className="w-6 h-6 text-[#15803d]" />
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {locale === 'te' ? 'ప్రస్తుత సీజన్' : 'Current Season'}
                  </div>
                  <div className="text-sm font-bold text-[#0A0A0A]">
                    {locale === 'te' ? advisoryData.seasonTe : advisoryData.season}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Market Prices (existing) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32"
          >
            <div className="p-12 bg-[#FAF9F6] shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[4rem] border border-gray-100 relative">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-[#0A0A0A] uppercase tracking-tighter">
                  {locale === 'te' ? 'మార్కెట్' : 'Market'} <span className="text-[#15803d]">{locale === 'te' ? 'ధరలు' : 'Prices'}</span>
                </h3>
                <Sparkles className="w-5 h-5 text-[#15803d]" />
              </div>
              <div className="space-y-4">
                {marketPrices.map((item, i) => (
                  <div key={i} className="p-6 bg-white rounded-3xl border border-gray-50 flex items-center justify-between group hover:bg-[#15803d] transition-all duration-500 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-10 bg-[#15803d] rounded-full group-hover:bg-white transition-colors" />
                      <span className="text-lg font-black text-[#0A0A0A] uppercase tracking-tighter group-hover:text-white transition-colors">{item.crop}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-[#0A0A0A] tracking-tighter group-hover:text-white transition-colors">{item.price}</div>
                      <div className={`text-[10px] font-black uppercase tracking-widest ${item.trend === 'up' ? 'text-[#15803d] group-hover:text-white' : item.trend === 'down' ? 'text-red-500 group-hover:text-white' : 'text-gray-400 group-hover:text-white'}`}>
                        {item.trend === 'up' ? '▲ ' + (locale === 'te' ? 'పెరుగుతోంది' : 'Increasing') : item.trend === 'down' ? '▼ ' + (locale === 'te' ? 'తగ్గుతోంది' : 'Decreasing') : '● ' + (locale === 'te' ? 'స్థిరం' : 'Stable')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-gray-200">
                <button className="w-full py-5 bg-[#15803d] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-[#15803d]/20 flex items-center justify-center gap-3 group">
                  {locale === 'te' ? 'పూర్తి మార్కెట్ నివేదిక' : 'View Full Market Report'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
