'use client';

import { motion } from 'framer-motion';
import { Locale, getDictionary, getTranslations } from '@/lib/i18n';

interface FacilitiesProps {
  locale: Locale;
}

const facilities = [
  {
    key: 'schools',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    key: 'healthcare',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    key: 'roads',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    key: 'water',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547" />
      </svg>
    ),
  },
  {
    key: 'electricity',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export default function Facilities({ locale }: FacilitiesProps) {
  const dictionary = getDictionary(locale);
  const t = getTranslations(dictionary);

  return (
    <section id="facilities" className="py-32 relative bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-[#15803d]/20">
            Infrastructure
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] mb-6 uppercase tracking-tighter">
            Village <span className="text-[#15803d]">Facilities</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto font-medium">
            Modern utilities and public services optimized for the future of Mallaram.
          </p>
        </motion.div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="h-full flex flex-col items-center text-center p-10 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[3rem] border border-gray-100 hover:border-[#15803d]/40 transition-all duration-500">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-[#FAF9F6] flex items-center justify-center text-gray-400 mb-8 group-hover:bg-[#15803d] group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  {facility.icon}
                </div>
                
                {/* Label */}
                <h3 className="text-xl font-black text-[#0A0A0A] mb-4 uppercase tracking-tighter group-hover:text-[#15803d] transition-colors">
                  {t(`facilities.${facility.key}`)}
                </h3>

                {/* Status indicator */}
                <div className="mt-auto pt-6 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#15803d] shadow-[0_0_10px_#15803d]"></span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#0A0A0A] transition-colors">Operational</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}