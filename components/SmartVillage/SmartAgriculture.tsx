'use client';

import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';

interface SmartAgricultureProps {
  locale: Locale;
}

export default function SmartAgriculture({ locale }: SmartAgricultureProps) {
  const dictionary = getDictionary(locale);

  const marketPrices = [
    { crop: 'Paddy', price: '₹2,183/q', trend: 'up' },
    { crop: 'Cotton', price: '₹7,020/q', trend: 'down' },
    { crop: 'Maize', price: '₹1,962/q', trend: 'up' },
    { crop: 'Chilli', price: '₹18,500/q', trend: 'stable' },
  ];

  return (
    <section id="agriculture" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-[#15803d]/20">
              Agritech Hub
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-[#0A0A0A] mb-10 tracking-tighter uppercase leading-[0.9]">
              Precision <br /><span className="text-[#15803d]">Agriculture</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed font-medium">
              Empowering Mallaram farmers with real-time market data, soil analytics, and AI-driven weather advisory.
            </p>

            <div className="space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-[#FAF9F6] border border-gray-100 flex items-center justify-between group hover:border-[#15803d]/30 transition-all duration-500">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#15803d] flex items-center justify-center text-white text-2xl shadow-lg">🌡️</div>
                  <div>
                    <h4 className="text-xl font-black text-[#0A0A0A] uppercase tracking-tighter leading-none mb-2">Weather Advisory</h4>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Chance of rain: 20% | Temp: 32°C</p>
                  </div>
                </div>
                <div className="hidden sm:block text-[10px] font-black text-[#15803d] uppercase tracking-[0.2em]">Optimal for Sowing</div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-[#FAF9F6] border border-gray-100 flex items-center justify-between group hover:border-[#15803d]/30 transition-all duration-500">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#15803d] flex items-center justify-center text-white text-2xl shadow-lg">🤖</div>
                  <div>
                    <h4 className="text-xl font-black text-[#0A0A0A] uppercase tracking-tighter leading-none mb-2">AI Soil Insights</h4>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Nitrogen Levels: High | Moisture: Balanced</p>
                  </div>
                </div>
                <div className="hidden sm:block text-[10px] font-black text-[#15803d] uppercase tracking-[0.2em]">Healthy Soil</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 bg-[#FAF9F6] shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[4rem] border border-gray-100 relative"
          >
            <h3 className="text-2xl font-black text-[#0A0A0A] mb-10 uppercase tracking-tighter">Market <span className="text-[#15803d]">Prices</span></h3>
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
                      {item.trend === 'up' ? '▲ Increasing' : item.trend === 'down' ? '▼ Decreasing' : '● Stable'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-gray-200">
              <button className="w-full py-5 bg-[#15803d] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-[#15803d]/20">
                View Full Market Report
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
