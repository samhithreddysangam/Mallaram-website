'use client';

import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';

interface StatsProps {
  locale: Locale;
}

export default function Stats({ locale }: StatsProps) {
  const dictionary = getDictionary(locale);

  const stats = [
    { label: 'Population', value: '2000+', icon: '👥' },
    { label: 'Households', value: '400+', icon: '🏠' },
    { label: 'Schools', value: '2', icon: '🏫' },
    { label: 'Literacy', value: '85%', icon: '📚' },
  ];

  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-3xl border border-gray-100 group-hover:border-[#15803d]/50 transition-colors duration-500" />
              <div className="relative p-6 md:p-8 flex flex-col items-center text-center">
                <span className="text-3xl md:text-4xl mb-4 transform group-hover:scale-125 transition-transform duration-500">
                  {stat.icon}
                </span>
                <h3 className="text-2xl md:text-4xl font-black text-[#0A0A0A] mb-1 tracking-tighter">
                  {stat.value}
                </h3>
                <p className="text-[10px] md:text-xs font-bold text-[#15803d] uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
                
                {/* Organic Wobble Animation Decorator */}
                <motion.div
                  animate={{
                    borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 20% 80% / 25% 80% 20% 75%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -z-10 w-20 h-20 bg-[#15803d]/5 blur-xl group-hover:bg-[#15803d]/10 transition-colors"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
