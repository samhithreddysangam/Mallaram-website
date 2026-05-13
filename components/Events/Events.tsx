'use client';

import { motion } from 'framer-motion';
import { Locale, getDictionary, getTranslations } from '@/lib/i18n';

interface EventsProps {
  locale: Locale;
}

const events = [
  {
    id: 1,
    title: 'Bonalu Festival',
    description: 'Annual thanksgiving festival dedicated to Goddess Mahakali, featuring traditional rituals.',
    image: 'https://images.unsplash.com/photo-1513175242576-9f5af6fcd91c?w=600&q=80',
    category: 'festivals',
    date: 'July 15',
  },
  {
    id: 2,
    title: 'Sankranti Celebration',
    description: 'Harvest festival celebrated with kite flying and community gatherings.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
    category: 'festivals',
    date: 'Jan 14',
  },
  {
    id: 3,
    title: 'Village Sports Day',
    description: 'Annual sports event featuring cricket matches and traditional games.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    category: 'local',
    date: 'Aug 20',
  },
  {
    id: 4,
    title: 'Cultural Meet',
    description: 'Monthly cultural gathering showcasing local talent in music and dance.',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
    category: 'local',
    date: 'Every 2nd Sun',
  },
];

export default function Events({ locale }: EventsProps) {
  const dictionary = getDictionary(locale);
  const t = getTranslations(dictionary);

  return (
    <section id="events" className="py-32 relative bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-[#15803d]/20">
            Happenings
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] mb-6 uppercase tracking-tighter">
            Community <span className="text-[#15803d]">Calendar</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto font-medium">
            Stay updated with the cultural heartbeat and local gatherings of Mallaram.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Festivals */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-[#0A0A0A] uppercase tracking-widest">
                {t('events.festivals')}
              </h3>
              <span className="text-[#15803d] text-[10px] font-black uppercase tracking-widest">Tradition</span>
            </div>
            <div className="space-y-6">
              {events
                .filter((e) => e.category === 'festivals')
                .map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex gap-6 p-6 bg-white rounded-[2.5rem] border border-gray-100 hover:border-[#15803d]/40 transition-all duration-500 shadow-sm"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-[#15803d] text-[9px] font-black uppercase tracking-widest mb-2">{event.date}</div>
                      <h4 className="text-xl font-black text-[#0A0A0A] mb-2 uppercase tracking-tighter group-hover:text-[#15803d] transition-colors">{event.title}</h4>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed">{event.description}</p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Local Events */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-[#0A0A0A] uppercase tracking-widest">
                {t('events.localEvents')}
              </h3>
              <span className="text-[#15803d] text-[10px] font-black uppercase tracking-widest">Community</span>
            </div>
            <div className="space-y-6">
              {events
                .filter((e) => e.category === 'local')
                .map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex gap-6 p-6 bg-white rounded-[2.5rem] border border-gray-100 hover:border-[#15803d]/40 transition-all duration-500 shadow-sm"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-[#15803d] text-[9px] font-black uppercase tracking-widest mb-2">{event.date}</div>
                      <h4 className="text-xl font-black text-[#0A0A0A] mb-2 uppercase tracking-tighter group-hover:text-[#15803d] transition-colors">{event.title}</h4>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed">{event.description}</p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}