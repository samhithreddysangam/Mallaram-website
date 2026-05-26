'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';

interface TransparencyPortalProps {
  locale: Locale;
}

const PHASE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Planning': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  'In Progress': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Completed': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  'Approved': { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
};

export default function TransparencyPortal({ locale }: TransparencyPortalProps) {
  const dictionary = getDictionary(locale);
  const [fundRecords, setFundRecords] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/fund-usage').then(res => res.json()),
      fetch('/api/fund-allocations').then(res => res.json()),
    ])
      .then(([fundData, allocData]) => {
        setFundRecords(Array.isArray(fundData) ? fundData : []);
        setAllocations(Array.isArray(allocData) ? allocData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load fund data:', err);
        setLoading(false);
      });
  }, []);

  const totalAllocated = allocations.reduce((sum: number, a: any) => sum + a.totalAmount, 0);
  const totalUsed = fundRecords.reduce((sum: number, r: any) => sum + r.amount, 0);
  const remaining = totalAllocated - totalUsed;
  const usagePercent = totalAllocated > 0 ? Math.min(100, (totalUsed / totalAllocated) * 100) : 0;

  const phaseCounts: Record<string, number> = {};
  fundRecords.forEach((r: any) => {
    const p = r.phase || 'Completed';
    phaseCounts[p] = (phaseCounts[p] || 0) + 1;
  });

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
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Total Govt Fund</span>
                <span className="text-3xl font-black text-[#0A0A0A] tracking-tighter">
                  {loading ? '...' : `₹${(totalAllocated / 100000).toFixed(1)}L`}
                </span>
                <p className="text-[10px] font-black text-[#15803d] uppercase tracking-widest mt-4">{allocations.length} Allocation{allocations.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-[#FAF9F6] border border-gray-100 group hover:border-[#15803d]/30 transition-all duration-500">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Total Used</span>
                <span className="text-3xl font-black text-[#0A0A0A] tracking-tighter">
                  {loading ? '...' : `₹${(totalUsed / 100000).toFixed(1)}L`}
                </span>
                <p className="text-[10px] font-black text-[#15803d] uppercase tracking-widest mt-4">{fundRecords.length} Records</p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-[#FAF9F6] border border-gray-100 group hover:border-[#15803d]/30 transition-all duration-500">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Remaining Fund</span>
                <span className={`text-3xl font-black tracking-tighter ${remaining > 0 ? 'text-[#15803d]' : 'text-red-500'}`}>
                  {loading ? '...' : `₹${(remaining / 100000).toFixed(1)}L`}
                </span>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">Available Balance</p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-[#FAF9F6] border border-gray-100 group hover:border-[#15803d]/30 transition-all duration-500">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Utilization</span>
                <span className="text-3xl font-black text-[#0A0A0A] tracking-tighter">
                  {loading ? '...' : `${usagePercent.toFixed(1)}%`}
                </span>
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-amber-500' : 'bg-[#15803d]'}`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Allocations Breakdown */}
            {allocations.length > 0 && (
              <div className="mt-8 p-6 rounded-[2.5rem] bg-[#FAF9F6] border border-gray-100">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Fund Allocations Breakdown</h4>
                <div className="space-y-3">
                  {allocations.map((alloc: any) => (
                    <div key={alloc.id} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-[#0A0A0A]">{alloc.source || 'General Grant'}</span>
                        <span className="text-[10px] text-gray-400 ml-2 font-medium">({alloc.fiscalYear})</span>
                      </div>
                      <span className="text-sm font-black text-[#15803d]">₹{(alloc.totalAmount / 100000).toFixed(1)}L</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-black text-[#0A0A0A] mb-8 uppercase tracking-tighter">
              Fund <span className="text-[#15803d]">Allocations</span>
              <span className="ml-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                ({fundRecords.filter((r: any) => r.phase === 'Completed').length} completed)
              </span>
            </h3>

            {/* Phase Legend */}
            <div className="flex flex-wrap gap-3 mb-6">
              {Object.entries(PHASE_COLORS).map(([phase, colors]) => (
                <div key={phase} className={`px-3 py-1.5 rounded-full ${colors.bg} flex items-center gap-1.5`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  <span className={`text-[9px] font-black uppercase tracking-widest ${colors.text}`}>{phase}</span>
                  <span className={`text-[9px] font-black ${colors.text} opacity-60`}>
                    ({phaseCounts[phase] || 0})
                  </span>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#15803d]/20 border-t-[#15803d] rounded-full animate-spin" />
              </div>
            ) : fundRecords.length === 0 ? (
              <div className="p-8 bg-[#FAF9F6] rounded-[3rem] border border-gray-100 text-center">
                <p className="text-gray-300 font-bold italic">No fund records yet. Data will appear once admin adds entries.</p>
              </div>
            ) : (
              fundRecords.slice(0, 6).map((record: any, i: number) => {
                const phaseStyle = PHASE_COLORS[record.phase] || PHASE_COLORS['Completed'];
                return (
                  <div key={record.id} className="p-8 bg-[#FAF9F6] shadow-sm rounded-[3rem] border border-gray-100 group hover:bg-white transition-all duration-500">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-black text-[#0A0A0A] uppercase tracking-tighter group-hover:text-[#15803d] transition-colors truncate">{record.label}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                          {record.category || 'General'} • {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span className="px-4 py-1.5 bg-[#15803d]/10 text-[#15803d] rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                          ₹{(record.amount / 100000).toFixed(1)}L
                        </span>
                        <div className="flex items-center gap-1.5 mt-2 justify-end">
                          <span className={`w-1.5 h-1.5 rounded-full ${phaseStyle.dot}`} />
                          <span className={`text-[9px] font-black uppercase tracking-widest ${phaseStyle.text}`}>
                            {record.phase || 'Completed'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {record.fundSource && (
                      <div className="mb-2">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                          Source: {record.fundSource}
                        </span>
                      </div>
                    )}
                    {record.description && (
                      <p className="text-sm text-gray-600 leading-relaxed mt-2">{record.description}</p>
                    )}
                  </div>
                );
              })
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
