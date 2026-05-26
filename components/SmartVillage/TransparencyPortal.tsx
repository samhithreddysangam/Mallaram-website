'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';

interface TransparencyPortalProps {
  locale: Locale;
}

export default function TransparencyPortal({ locale }: TransparencyPortalProps) {
  const dictionary = getDictionary(locale);
  const [fundRecords, setFundRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fund-usage')
      .then(res => res.json())
      .then(data => {
        setFundRecords(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load fund usage:', err);
        setLoading(false);
      });
  }, []);

  const totalAmount = fundRecords.reduce((sum: number, r: any) => sum + r.amount, 0);

  return (
    <section id="transparency" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-[#15803d]/20">
              Public Information
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-[#0A0A0A] mb-10 tracking-tighter uppercase leading-[0.9]">
              Village <br /><span className="text-[#15803d]">Funds & Projects</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed font-medium">
              See how village funds are being used, which projects are running, and how decisions are made. Everything is open to the public.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 rounded-[2.5rem] bg-[#FAF9F6] border border-gray-100 group hover:border-[#15803d]/30 transition-all duration-500">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Total Funds Used</span>
                <span className="text-3xl font-black text-[#0A0A0A] tracking-tighter">
                  {loading ? '...' : `₹${(totalAmount / 100000).toFixed(1)}L`}
                </span>
                <p className="text-[10px] font-black text-[#15803d] uppercase tracking-widest mt-4">{fundRecords.length} Records</p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-[#FAF9F6] border border-gray-100 group hover:border-[#15803d]/30 transition-all duration-500">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Categories</span>
                <span className="text-3xl font-black text-[#0A0A0A] tracking-tighter">
                  {loading ? '...' : new Set(fundRecords.map((r: any) => r.category).filter(Boolean)).size}
                </span>
                <p className="text-[10px] font-black text-[#15803d] uppercase tracking-widest mt-4">Fund Allocation</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-black text-[#0A0A0A] mb-8 uppercase tracking-tighter">Fund <span className="text-[#15803d]">Allocations</span></h3>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#15803d]/20 border-t-[#15803d] rounded-full animate-spin" />
              </div>
            ) : fundRecords.length === 0 ? (
              <div className="p-8 bg-[#FAF9F6] rounded-[3rem] border border-gray-100 text-center">
                <p className="text-gray-300 font-bold italic">No fund records yet. Data will appear once admin adds entries.</p>
              </div>
            ) : (
              fundRecords.slice(0, 6).map((record: any, i: number) => (
                <div key={record.id} className="p-8 bg-[#FAF9F6] shadow-sm rounded-[3rem] border border-gray-100 group hover:bg-white transition-all duration-500">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="text-xl font-black text-[#0A0A0A] uppercase tracking-tighter group-hover:text-[#15803d] transition-colors">{record.label}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {record.category || 'General'} • {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-4 py-1.5 bg-[#15803d]/10 text-[#15803d] rounded-full text-[10px] font-black uppercase tracking-widest">
                      ₹{(record.amount / 100000).toFixed(1)}L
                    </span>
                  </div>
                  {record.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{record.description}</p>
                  )}
                </div>
              ))
            )}
            {fundRecords.length > 6 && (
              <button className="w-full py-5 border border-gray-200 text-[#0A0A0A] text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#15803d] hover:text-white hover:border-[#15803d] transition-all">
                View All {fundRecords.length} Records
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
