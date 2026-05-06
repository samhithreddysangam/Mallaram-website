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
    <section className="relative py-12 md:py-20 overflow-hidden bg-[#0A0A0A]">
      {/* Glassmorphic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-[#22FF88]/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -45, 0],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"
        />
      </div>

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
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 group-hover:border-[#22FF88]/50 transition-colors duration-500 shadow-2xl" />
              <div className="relative p-6 md:p-8 flex flex-col items-center text-center">
                <span className="text-3xl md:text-4xl mb-4 transform group-hover:scale-125 transition-transform duration-500">
                  {stat.icon}
                </span>
                <h3 className="text-2xl md:text-4xl font-black text-white mb-1 tracking-tighter">
                  {stat.value}
                </h3>
                <p className="text-[10px] md:text-xs font-bold text-[#22FF88] uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
                
                {/* Organic Wobble Animation Decorator */}
                <motion.div
                  animate={{
                    borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 20% 80% / 25% 80% 20% 75%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -z-10 w-20 h-20 bg-[#22FF88]/5 blur-xl group-hover:bg-[#22FF88]/20 transition-colors"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
