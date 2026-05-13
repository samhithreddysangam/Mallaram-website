'use client';

import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';

interface GalleryProps {
  locale: Locale;
}

const galleryImages = [
  { src: '/images/gallery/gallery-1.jpg', alt: 'Mallaram Gallery 1' },
  { src: '/images/gallery/gallery-2.jpg', alt: 'Mallaram Gallery 2' },
  { src: '/images/gallery/gallery-3.jpg', alt: 'Mallaram Gallery 3' },
  { src: '/images/gallery/gallery-4.jpg', alt: 'Mallaram Gallery 4' },
  { src: '/images/gallery/gallery-5.jpg', alt: 'Mallaram Gallery 5' },
  { src: '/images/gallery/gallery-6.jpg', alt: 'Mallaram Gallery 6' },
  { src: '/images/gallery/gallery-7.jpg', alt: 'Mallaram Gallery 7' },
  { src: '/images/gallery/gallery-8.jpg', alt: 'Mallaram Gallery 8' },
];

export default function Gallery({ locale }: GalleryProps) {
  const dictionary = getDictionary(locale);

  return (
    <section id="gallery" className="py-32 relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-[#15803d]/20">
            Visual Journey
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] mb-6 uppercase tracking-tighter">
            Village <span className="text-[#15803d]">Archive</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto font-medium">
            Capturing the essence of Mallaram through the lens of community and progress.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.8 }}
              className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-gray-100 bg-[#FAF9F6]"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-500" />
              
              <div className="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-[10px] font-black text-[#15803d] uppercase tracking-[0.2em] mb-1 block">Mallaram</span>
                <span className="text-white font-bold text-sm">Village Perspective</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-20 text-center">
          <button className="px-12 py-5 bg-[#FAF9F6] text-[#0A0A0A] border border-gray-200 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#15803d] hover:text-white hover:border-[#15803d] transition-all shadow-2xl">
            Explore Full Gallery
          </button>
        </div>
      </div>
    </section>
  );
}