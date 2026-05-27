'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { Users } from 'lucide-react';

interface NavigationProps {
  locale: Locale;
}

interface VillageOfficial {
  id: string;
  name: string;
  title: string;
  imageUrl: string | null;
  description: string | null;
  order: number;
  active: boolean;
}

function OfficialImage({ official }: { official: VillageOfficial }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-4 group px-2"
    >
      <div className="w-16 h-16 md:w-24 md:h-24 aspect-square rounded-[2rem] bg-white p-1 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center overflow-hidden transform group-hover:scale-105 group-hover:border-[#15803d]/40 transition-all duration-500">
        {official.imageUrl ? (
          <img 
            src={official.imageUrl} 
            alt={official.name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#15803d]/5 to-[#15803d]/10">
            <Users className="w-8 h-8 md:w-12 md:h-12 text-[#15803d]/30" />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[10px] md:text-xs text-[#0A0A0A] font-black uppercase tracking-[0.15em] text-center mb-0.5 leading-tight max-w-[140px] md:max-w-[180px]">
          {official.name}
        </span>
        <span className="text-[8px] md:text-[10px] text-[#15803d] font-bold uppercase tracking-widest text-center leading-tight max-w-[140px] md:max-w-[180px]">
          {official.title}
        </span>
      </div>
    </motion.div>
  );
}

export default function OfficialsSection({ locale }: NavigationProps) {
  const [officials, setOfficials] = useState<VillageOfficial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const res = await fetch('/api/village-officials');
        const data = await res.json();
        const active = Array.isArray(data)
          ? data.filter((o: VillageOfficial) => o.active).sort((a, b) => a.order - b.order)
          : [];
        setOfficials(active);
      } catch (error) {
        console.error('Failed to fetch officials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOfficials();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#FAF9F6] py-8 md:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-[2rem] bg-gray-200" />
                <div className="h-3 w-20 md:w-28 bg-gray-200 rounded" />
                <div className="h-2 w-16 md:w-20 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (officials.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#FAF9F6] py-8 md:py-16 border-b border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-6 no-scrollbar md:flex-wrap md:justify-center md:overflow-visible md:pb-0 md:mx-0 md:px-0 scroll-smooth snap-x snap-mandatory">
          {officials.slice(0, 5).map((official) => (
            <div key={official.id} className="flex-shrink-0 w-[160px] md:w-auto flex justify-center snap-center">
              <OfficialImage official={official} />  
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
