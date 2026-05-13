'use client';

import { motion } from 'framer-motion';
import { Waves, Droplets, Droplet, Target } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n';

interface WaterGovernanceProps {
  locale: Locale;
}

export default function WaterGovernance({ locale }: WaterGovernanceProps) {
  const dictionary = getDictionary(locale);

  const waterSources = [
    { label: 'Main Reservoir', level: 85, status: 'Stable', icon: Waves },
    { label: 'Village Tank 1', level: 72, status: 'Normal', icon: Droplets },
    { label: 'Village Tank 2', level: 90, status: 'High', icon: Droplets },
    { label: 'Canal Flow', level: 45, status: 'Low', icon: Waves },
  ];

  return (
    <section id="water" className="py-24 bg-[#FAF9F6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#0ea5e9]/10 text-[#0ea5e9] text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-[#0ea5e9]/20">
            Resource Management
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] mb-6 uppercase tracking-tighter">
            Water <span className="text-[#0ea5e9]">Governance</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto font-medium">
            Real-time tracking of water resources and consumption patterns to ensure sustainable supply for every household.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {waterSources.map((source, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-10 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[3rem] border border-gray-100 hover:border-[#0ea5e9]/40 transition-all duration-500 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500">
                <source.icon className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-[#0A0A0A] mb-8 uppercase tracking-tighter">{source.label}</h4>
              
              <div className="relative h-48 w-24 mx-auto bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${source.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0ea5e9] to-[#38bdf8]"
                >
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute top-0 left-0 w-full h-4 bg-white/20 blur-sm"
                  />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-[#0A0A0A] group-hover:text-white transition-colors drop-shadow-sm">{source.level}%</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0ea5e9] shadow-[0_0_10px_#0ea5e9]"></span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{source.status}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-12 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[4rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-3xl bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-[#0A0A0A] uppercase tracking-tighter leading-none mb-2">Conservation Target</h4>
              <p className="text-gray-500 font-medium">Reduce waste by 15% this quarter</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="px-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl">
              <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Daily Usage</span>
              <span className="text-xl font-black text-[#0A0A0A] tracking-tighter">180K Liters</span>
            </div>
            <div className="px-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl">
              <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Quality Score</span>
              <span className="text-xl font-black text-[#15803d] tracking-tighter">98/100</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
