'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';

interface HeroProps {
  locale: Locale;
}

const heroImages = [
  { src: '/images/hero/hero-1.jpg', alt: 'Mallaram' },
  { src: '/images/hero/hero-2.jpg', alt: 'Village' },
  { src: '/images/hero/hero-3.jpg', alt: 'Community' },
  { src: '/images/hero/hero-4.jpg', alt: 'Agriculture' },
  { src: '/images/hero/hero-5.jpg', alt: 'Culture' },
];

export default function Hero({ locale }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dictionary = getDictionary(locale);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative h-screen min-h-[700px] overflow-hidden flex items-center bg-[#FAF9F6]">
      {/* Background Media */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.3, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={heroImages[currentSlide].src}
            alt={heroImages[currentSlide].alt}
            className="w-full h-full object-cover opacity-60"
          />
          {/* Overlay Vignetts */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-[#FAF9F6]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-transparent to-[#FAF9F6]" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-10 w-96 h-96 bg-[#15803d]/5 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-[#15803d]/10 blur-[120px] rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 w-full">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-[#15803d]/20">
              Transforming Governance
            </span>
            <h1 className="text-6xl md:text-9xl font-black text-[#0A0A0A] mb-8 tracking-tighter leading-[0.85] uppercase">
              {dictionary.hero.title.split(' ')[0]} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A0A0A] via-[#15803d] to-[#0A0A0A]/40">
                {dictionary.hero.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
              <p className="text-gray-600 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
                {dictionary.hero.subtitle}
              </p>
              <div className="h-px w-24 bg-[#0A0A0A]/10 hidden md:block"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#15803d] uppercase tracking-[0.2em] mb-1">Impact Goal</span>
                <span className="text-[#0A0A0A] font-bold text-lg">100% Digital Inclusion</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-16 flex flex-wrap gap-4"
          >
            <a 
              href="#command-center" 
              className="px-10 py-5 bg-[#15803d] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-[#15803d]/20"
            >
              Explore Dashboard
            </a>
            <a 
              href="#complaint" 
              className="px-10 py-5 bg-white text-[#0A0A0A] border border-gray-200 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
            >
              Submit Grievance
            </a>
          </motion.div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 right-12 flex flex-col gap-3">
        {heroImages.map((_, i) => (
          <div 
            key={i}
            className={`w-1 h-8 rounded-full transition-all duration-500 ${i === currentSlide ? 'bg-[#15803d] h-12' : 'bg-black/10'}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <span className="text-[9px] font-black text-[#0A0A0A] uppercase tracking-[0.4em] [writing-mode:vertical-lr]">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-[#0A0A0A]/0 via-[#0A0A0A] to-[#0A0A0A]/0"></div>
      </motion.div>
    </section>
  );
}