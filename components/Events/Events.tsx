'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Locale, getDictionary, getTranslations } from '@/lib/i18n';
import { CalendarDays } from 'lucide-react';

interface EventsProps {
  locale: Locale;
}

interface VillageEvent {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  date: string;
  category: string;
  order: number;
  active: boolean;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80';

export default function Events({ locale }: EventsProps) {
  const [events, setEvents] = useState<VillageEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const dictionary = getDictionary(locale);
  const t = getTranslations(dictionary);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        const active = Array.isArray(data)
          ? data.filter((e: VillageEvent) => e.active).sort((a, b) => a.order - b.order)
          : [];
        setEvents(active);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const festivals = events.filter((e) => e.category === 'festivals');
  const localEvents = events.filter((e) => e.category === 'local');

  if (loading) {
    return (
      <section id="events" className="py-32 relative bg-[#FAF9F6] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-24">
            <div className="w-32 h-4 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse" />
            <div className="w-64 h-10 bg-gray-200 rounded-xl mx-auto mb-4 animate-pulse" />
            <div className="w-48 h-4 bg-gray-100 rounded-full mx-auto animate-pulse" />
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-6 p-6 bg-white rounded-[2.5rem] border border-gray-100 animate-pulse">
                <div className="w-24 h-24 rounded-2xl bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                  <div className="h-5 w-40 bg-gray-200 rounded" />
                  <div className="h-3 w-56 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

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
            Latest News
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] mb-6 uppercase tracking-tighter">
            Village <span className="text-[#15803d]">Events</span>
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
            {festivals.length === 0 ? (
              <div className="text-center py-12 text-gray-300 font-bold italic">
                No festivals listed yet
              </div>
            ) : (
              <div className="space-y-6">
                {festivals.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex gap-6 p-6 bg-white rounded-[2.5rem] border border-gray-100 hover:border-[#15803d]/40 transition-all duration-500 shadow-sm"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      ) : (
                        <CalendarDays className="w-8 h-8 text-[#15803d]/30" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-[#15803d] text-[9px] font-black uppercase tracking-widest mb-2">{event.date}</div>
                      <h4 className="text-xl font-black text-[#0A0A0A] mb-2 uppercase tracking-tighter group-hover:text-[#15803d] transition-colors">{event.title}</h4>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed">{event.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Local Events */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-[#0A0A0A] uppercase tracking-widest">
                {t('events.localEvents')}
              </h3>
              <span className="text-[#15803d] text-[10px] font-black uppercase tracking-widest">Community</span>
            </div>
            {localEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-300 font-bold italic">
                No local events listed yet
              </div>
            ) : (
              <div className="space-y-6">
                {localEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex gap-6 p-6 bg-white rounded-[2.5rem] border border-gray-100 hover:border-[#15803d]/40 transition-all duration-500 shadow-sm"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      ) : (
                        <CalendarDays className="w-8 h-8 text-[#15803d]/30" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-[#15803d] text-[9px] font-black uppercase tracking-widest mb-2">{event.date}</div>
                      <h4 className="text-xl font-black text-[#0A0A0A] mb-2 uppercase tracking-tighter group-hover:text-[#15803d] transition-colors">{event.title}</h4>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed">{event.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
