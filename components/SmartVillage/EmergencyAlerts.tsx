'use client';

import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';

interface EmergencyAlertsProps {
  locale: Locale;
}

export default function EmergencyAlerts({ locale }: EmergencyAlertsProps) {
  const dictionary = getDictionary(locale);

  const alerts = [
    { title: 'Heavy Rain Warning', type: 'Critical', time: '2h ago', desc: 'Expected heavy rainfall in the next 24 hours. Farmers are advised to secure crops.' },
    { title: 'Vaccination Camp', type: 'Update', time: '5h ago', desc: 'Free medical camp at PHC Mallaram tomorrow starting at 9 AM.' },
    { title: 'Gram Sabha Meeting', type: 'Reminder', time: '1d ago', desc: 'Monthly village meeting scheduled for Sunday at the Panchayat Office.' },
  ];

  return (
    <section id="alerts" className="py-24 bg-[#FAF9F6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-red-500/20">
            Real-time Updates
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] mb-6 uppercase tracking-tighter">
            Village <span className="text-red-500">Alert</span> System
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto font-medium">
            Stay informed with critical notifications, public announcements, and emergency services.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {alerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 rounded-[3rem] border backdrop-blur-xl transition-all duration-500 group ${
                alert.type === 'Critical' 
                  ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/50' 
                  : 'bg-white border-gray-100 hover:border-[#15803d]/40 shadow-sm'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${alert.type === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-[#15803d]'}`} />
                  <h4 className={`text-2xl font-black tracking-tighter uppercase ${alert.type === 'Critical' ? 'text-red-500' : 'text-[#0A0A0A]'}`}>
                    {alert.title}
                  </h4>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{alert.time}</span>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${alert.type === 'Critical' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {alert.type}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed font-medium mb-10">
                {alert.desc}
              </p>
              <div className="flex gap-4">
                <button className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${alert.type === 'Critical' ? 'bg-red-500 text-white' : 'bg-[#15803d] text-white'}`}>
                  Acknowledged
                </button>
                <button className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-200 text-gray-400 hover:bg-gray-50">
                  Share
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Emergency Contact Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-red-600 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl shadow-red-600/20"
        >
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-[2rem] bg-white/10 flex items-center justify-center text-4xl">🚨</div>
            <div>
              <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">Emergency Help</h3>
              <p className="text-red-100 font-bold uppercase tracking-widest text-xs opacity-70">24/7 Rapid Response Unit</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-center md:text-right">
              <span className="block text-red-200 text-[10px] font-black uppercase tracking-widest mb-1">Police / Fire / Medical</span>
              <span className="text-5xl font-black tracking-tighter">100 / 108</span>
            </div>
            <a href="tel:108" className="px-12 py-6 bg-white text-red-600 text-[12px] font-black uppercase tracking-[0.2em] rounded-3xl hover:scale-105 transition-all shadow-xl">
              Call Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
