'use client';

import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';

interface VillageMapProps {
  locale: Locale;
}

export default function VillageMap({ locale }: VillageMapProps) {
  const dictionary = getDictionary(locale);

  const landmarks = [
    { name: 'Panchayat Office', type: 'Govt', pos: 'top-1/4 left-1/3' },
    { name: 'Government School', type: 'Edu', pos: 'bottom-1/3 left-1/2' },
    { name: 'Public Health Center', type: 'Med', pos: 'top-1/2 right-1/4' },
    { name: 'Community Hall', type: 'Social', pos: 'bottom-1/4 right-1/3' },
  ];

  return (
    <section id="map" className="py-24 bg-[#FAF9F6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-[#15803d]/20">
            GIS Visualization
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] mb-6 tracking-tighter uppercase">
            Village <span className="text-[#15803d]">Spatial</span> Map
          </h2>
          <p className="text-gray-600 max-w-xl text-lg font-medium">
            Interactive GIS layout of Mallaram village, showcasing key landmarks, infrastructure nodes, and developmental projects.
          </p>
        </motion.div>

        <div className="relative aspect-[16/9] w-full bg-white rounded-[4rem] border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.03)] overflow-hidden group">
          {/* Abstract Map Grid */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#15803d 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          {/* Mock Map Features */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 500">
            <path d="M0,250 Q250,100 500,250 T1000,250" fill="none" stroke="#15803d" strokeWidth="40" />
            <path d="M500,0 L500,500" fill="none" stroke="#15803d" strokeWidth="20" />
          </svg>

          {/* Landmarks */}
          {landmarks.map((mark, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, type: 'spring' }}
              className={`absolute ${mark.pos} flex flex-col items-center group/mark`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#15803d]/20 shadow-xl flex items-center justify-center text-xl group-hover/mark:bg-[#15803d] group-hover/mark:text-white transition-all duration-500 cursor-pointer">
                {mark.type === 'Govt' ? '🏛️' : mark.type === 'Edu' ? '🎓' : mark.type === 'Med' ? '🏥' : '🤝'}
              </div>
              <div className="mt-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl border border-gray-50 shadow-sm opacity-0 group-hover/mark:opacity-100 transition-opacity duration-500 whitespace-nowrap">
                <p className="text-[10px] font-black text-[#0A0A0A] uppercase tracking-widest">{mark.name}</p>
              </div>
            </motion.div>
          ))}

          {/* UI Overlays */}
          <div className="absolute bottom-10 left-10 p-8 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 shadow-2xl space-y-4 max-w-xs">
            <h4 className="text-xl font-black text-[#0A0A0A] uppercase tracking-tighter">Legend</h4>
            <div className="space-y-3">
              {[
                { label: 'Infrastructure', color: 'bg-[#15803d]' },
                { label: 'Water Nodes', color: 'bg-blue-500' },
                { label: 'Waste Collection', color: 'bg-amber-500' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
