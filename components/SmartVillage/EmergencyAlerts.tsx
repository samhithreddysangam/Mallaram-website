'use client';

import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Info, Zap, Droplets, Phone, ShieldAlert, Wifi, ArrowRight, Share2, CheckCircle2 } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n';

interface EmergencyAlertsProps {
  locale: Locale;
}

export default function EmergencyAlerts({ locale }: EmergencyAlertsProps) {
  const dictionary = getDictionary(locale);

  const alerts = [
    { 
      title: 'Heavy Rain Warning', 
      type: 'Critical', 
      time: '2h ago', 
      desc: 'Expected heavy rainfall in the next 24 hours. Farmers are advised to secure crops and avoid low-lying areas.',
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20'
    },
    { 
      title: 'Vaccination Camp', 
      type: 'Announcement', 
      time: '5h ago', 
      desc: 'Free medical camp at PHC Mallaram tomorrow starting at 9 AM. Please bring your health cards.',
      icon: Info,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    { 
      title: 'Gram Sabha Meeting', 
      type: 'Reminder', 
      time: '1d ago', 
      desc: 'Monthly village meeting scheduled for Sunday at the Panchayat Office to discuss development funds.',
      icon: Bell,
      color: 'text-[#15803d]',
      bg: 'bg-[#15803d]/10',
      border: 'border-[#15803d]/20'
    },
  ];

  const statuses = [
    { label: 'Electricity', status: 'Active', icon: Zap, color: 'text-amber-500' },
    { label: 'Water Supply', status: 'Next: 6AM', icon: Droplets, color: 'text-blue-500' },
    { label: 'Village WiFi', status: 'Online', icon: Wifi, color: 'text-green-500' },
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
                Latest Updates
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-[#0A0A0A] mb-8 uppercase tracking-tighter leading-[0.9]">
                Village <span className="text-red-500">Alert</span> System
              </h2>
              <p className="text-gray-600 font-medium leading-relaxed mb-10">
                Stay informed with critical notifications, public announcements, and emergency services.
              </p>
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

          {/* Right Column: Alert Timeline */}
          <div className="lg:col-span-2 space-y-6">
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
                  <h4 className="text-xl font-black uppercase tracking-tighter">Stay Notified</h4>
                  <p className="text-gray-400 text-sm font-medium">Get real-time alerts via WhatsApp & SMS</p>
                </div>
              </div>
              <button className="w-full md:w-auto px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#15803d] hover:text-white transition-all">
                Get Alerts on WhatsApp
              </button>
            </motion.div>
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
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.8] mb-3">Emergency Help</h3>
              <p className="text-red-100 font-bold uppercase tracking-widest text-[10px] md:text-xs opacity-80">Help Available 24 Hours</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 w-full lg:w-auto">
            <div className="text-center md:text-right">
              <span className="block text-red-200 text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">Police / Fire / Medical</span>
              <span className="text-5xl md:text-7xl font-black tracking-tighter">100 / 108</span>
            </div>
            <a href="tel:108" className="w-full md:w-auto px-12 md:px-16 py-6 md:py-8 bg-white text-red-600 text-[12px] md:text-[14px] font-black uppercase tracking-[0.2em] rounded-[2rem] md:rounded-[2.5rem] hover:bg-black hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 group">
              Call Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
