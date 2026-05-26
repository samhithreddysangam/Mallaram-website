'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Waves, Droplets, Droplet, Target, Thermometer, Gauge } from 'lucide-react';
import { Locale } from '@/lib/i18n';

const iconMap: Record<string, React.ElementType> = {
  Waves, Droplets, Droplet, Target, Thermometer, Gauge,
};

interface WaterGovernanceProps {
  locale: Locale;
}

export default function WaterGovernance({ locale }: WaterGovernanceProps) {
  const [waterSources, setWaterSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await fetch('/api/water-sources');
        const data = await res.json();
        setWaterSources(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch water sources:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSources();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'stable': case 'high': case 'normal': return { dot: 'bg-[#0ea5e9]', glow: '#0ea5e9' };
      case 'low': return { dot: 'bg-amber-500', glow: '#f59e0b' };
      case 'critical': return { dot: 'bg-red-500', glow: '#ef4444' };
      default: return { dot: 'bg-[#0ea5e9]', glow: '#0ea5e9' };
    }
  };

  if (loading) {
    return (
      <section id="water" className="py-24 bg-[#FAF9F6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#0ea5e9] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

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
            Water Supply
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] mb-6 uppercase tracking-tighter">
            Water <span className="text-[#0ea5e9]">Supply</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto font-medium">
            Check how much water is available in our village tanks and reservoirs. We make sure every home gets clean water.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {waterSources.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400 font-bold">
              No water sources configured yet. Ask your admin to add them.
            </div>
          ) : waterSources.map((source, i) => {
            const Icon = iconMap[source.icon] || Droplets;
            return (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[3rem] border border-gray-100 hover:border-[#0ea5e9]/40 transition-all duration-500 text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-10 h-10" />
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
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(source.status).dot} shadow-[0_0_10px_${getStatusColor(source.status).glow}]`}></span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{source.status}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {waterSources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 p-12 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[4rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-3xl bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center">
                <Target className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-2xl font-black text-[#0A0A0A] uppercase tracking-tighter leading-none mb-2">Water Saving Goal</h4>
                <p className="text-gray-500 font-medium">Save 15% more water this season</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="px-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Daily Usage</span>
                <span className="text-xl font-black text-[#0A0A0A] tracking-tighter">180K Liters</span>
              </div>
              <div className="px-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Water Quality</span>
                <span className="text-xl font-black text-[#15803d] tracking-tighter">98/100</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
