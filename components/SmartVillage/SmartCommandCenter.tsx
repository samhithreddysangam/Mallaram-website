'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Video, Recycle, Zap, Activity, Leaf, Droplets, Target, Shield, Wifi, TreePine, Building2 } from 'lucide-react';
import { Locale } from '@/lib/i18n';

const iconMap: Record<string, React.ElementType> = {
  Lightbulb, Video, Recycle, Zap, Activity,
  Leaf, Droplets, Target, Shield, Wifi, TreePine, Building2,
};

interface SmartCommandCenterProps {
  locale: Locale;
}

export default function SmartCommandCenter({ locale }: SmartCommandCenterProps) {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, perfRes] = await Promise.all([
          fetch('/api/village-metrics'),
          fetch('/api/village-performance'),
        ]);
        const metricsData = await metricsRes.json();
        const perfData = await perfRes.json();
        setMetrics(Array.isArray(metricsData) ? metricsData : []);
        setPerformance(Array.isArray(perfData) ? perfData : []);
      } catch (error) {
        console.error('Failed to fetch village data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="command-center" className="py-24 bg-[#FAF9F6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#15803d] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="command-center" className="py-24 bg-[#FAF9F6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-[#15803d]/20">
            Village Services
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] mb-6 tracking-tighter uppercase">
            Village <span className="text-[#15803d]">Overview</span>
          </h2>
          <p className="text-gray-600 max-w-xl text-lg font-medium">
            See how our village services like lights, roads, and water are working right now.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.length === 0 ? (
            <div className="lg:col-span-4 text-center py-12 text-gray-400 font-bold">
              No metrics configured yet. Ask your admin to add them.
            </div>
          ) : metrics.map((metric, i) => {
            const Icon = iconMap[metric.icon] || Activity;
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group p-10 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[3rem] border border-gray-100 hover:border-[#15803d]/40 transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-2xl ${metric.bg} ${metric.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{metric.label}</p>
                  <h4 className="text-3xl font-black text-[#0A0A0A] tracking-tighter">{metric.value}</h4>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#15803d] uppercase tracking-widest">{metric.status}</span>
                  <div className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Large Visualization Area */}
        {performance.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 p-12 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[4rem] border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <div className="w-64 h-64 border-[20px] border-[#15803d] rounded-full" />
            </div>
            <div className="grid lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-2 space-y-8">
                <h3 className="text-3xl font-black text-[#0A0A0A] uppercase tracking-tighter leading-none">
                  Village <span className="text-[#15803d]">Performance</span> Summary
                </h3>
                <div className="space-y-6">
                  {performance.map((item, i) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="text-[#15803d]">{item.value}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: i * 0.2 }}
                          className="h-full bg-[#15803d]" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#15803d]/5 p-8 rounded-[2.5rem] border border-[#15803d]/10">
                <p className="text-[10px] font-black text-[#15803d] uppercase tracking-[0.2em] mb-4">Current Status</p>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Mallaram infrastructure systems are connected with the Telangana State Village Network.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
