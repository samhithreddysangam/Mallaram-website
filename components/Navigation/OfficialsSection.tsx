'use client';

import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';

interface NavigationProps {
  locale: Locale;
}

const officials = [
  { 
    id: 1, 
    name: 'Shri A. Revanth Reddy', 
    title: 'Hon\'ble Chief Minister', 
    src: '/assets/officials/revanth.jpg', 
    alt: 'Chief Minister of Telangana' 
  },
  { 
    id: 2, 
    name: 'Smt D.Anasuya Seethakka', 
    title: 'Minister of PR & RD', 
    src: '/assets/officials/seethakka.jpg', 
    alt: 'Minister of Panchayat Raj & Rural Development' 
  },
  { 
    id: 3, 
    name: 'Shri Aadi Srinivas', 
    title: 'Hon\'ble MLA, Vemulawada', 
    src: '/assets/officials/aadi-srinivas.jpg', 
    alt: 'MLA Vemulawada' 
  },
  { 
    id: 4, 
    name: 'Smt Garima Agarwal, IAS', 
    title: 'Hon\'ble Collector', 
    src: '/assets/officials/garima-agarwal.jpg', 
    alt: 'District Collector' 
  },
  { 
    id: 5, 
    name: 'Smt Sangam Arpitha', 
    title: 'Sarpanch, Mallaram', 
    src: '/assets/officials/sarpanch.jpg', 
    alt: 'Mallaram Sarpanch' 
  },
];

function OfficialImage({ image }: { image: typeof officials[0] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-4 group px-2"
    >
      <div className="w-16 h-16 md:w-24 md:h-24 aspect-square rounded-[2rem] bg-white p-1 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center overflow-hidden transform group-hover:scale-105 group-hover:border-[#15803d]/40 transition-all duration-500">
        {image.src ? (
          <img 
            src={image.src} 
            alt={image.alt} 
            className="w-full h-full object-cover scale-[1.25] translate-y-[10%]" 
          />
        ) : (
          <div className="bg-gray-50 w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-[8px] font-black text-center px-1 uppercase leading-tight">{image.name}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[10px] md:text-xs text-[#0A0A0A] font-black uppercase tracking-[0.15em] text-center mb-0.5 whitespace-nowrap">{image.name}</span>
        <span className="text-[8px] md:text-[10px] text-[#15803d] font-bold uppercase tracking-widest text-center whitespace-nowrap">{image.title}</span>
      </div>
    </motion.div>
  );
}

export default function OfficialsSection({ locale }: NavigationProps) {
  return (
    <section className="bg-[#FAF9F6] py-8 md:py-16 border-b border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-6 no-scrollbar md:grid md:grid-cols-5 md:gap-x-8 md:pb-0 md:mx-0 md:px-0 scroll-smooth snap-x snap-mandatory">
          {officials.map((official) => (
            <div key={official.id} className="flex-shrink-0 w-[160px] md:w-auto flex justify-center snap-center">
              <OfficialImage image={official} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
