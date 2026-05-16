'use client';

import { motion } from 'framer-motion';
import { BarChart3, MessageSquare } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n';

interface GrievanceSystemProps {
  locale: Locale;
}

export default function GrievanceSystem({ locale }: GrievanceSystemProps) {
  const dictionary = getDictionary(locale);

  return (
    <section id="complaint" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-[#15803d]/20">
              Your Voice
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-[#0A0A0A] mb-10 tracking-tighter uppercase leading-[0.9]">
              Public <br /><span className="text-[#15803d]">Complaint</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed font-medium">
              Tell us about any problem in the village. We will look into it and fix it as soon as possible.
            </p>

            <div className="flex flex-col gap-6">
              {[
                { label: 'Problems Fixed', value: '428', icon: BarChart3 },
                { label: 'Average Fix Time', value: '3.2 Days', icon: MessageSquare },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-[#FAF9F6] border border-gray-100 group transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#15803d] shadow-sm group-hover:scale-110 transition-transform">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-[#0A0A0A] tracking-tighter">{stat.value}</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 bg-[#FAF9F6] shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[4rem] border border-gray-100"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#0A0A0A] uppercase tracking-widest ml-4">Full Name</label>
                  <input type="text" className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 focus:border-[#15803d] outline-none transition-all font-medium" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#0A0A0A] uppercase tracking-widest ml-4">Phone Number</label>
                  <input type="tel" className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 focus:border-[#15803d] outline-none transition-all font-medium" placeholder="10-digit mobile" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#0A0A0A] uppercase tracking-widest ml-4">Subject</label>
                <select className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 focus:border-[#15803d] outline-none transition-all font-medium appearance-none">
                  <option>Water Supply Issue</option>
                  <option>Street Light Repair</option>
                  <option>Waste Management</option>
                  <option>Road Infrastructure</option>
                  <option>Other Concern</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#0A0A0A] uppercase tracking-widest ml-4">Description</label>
                <textarea rows={4} className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 focus:border-[#15803d] outline-none transition-all font-medium resize-none" placeholder="Describe your issue in detail..." />
              </div>
              <button className="w-full py-6 bg-[#15803d] text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-3xl hover:scale-[1.02] transition-all shadow-xl shadow-[#15803d]/20 mt-4">
                Submit Complaint
              </button>
            </form>
            <p className="mt-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              You will get a number to check your complaint status.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
