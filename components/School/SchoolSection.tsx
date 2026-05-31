'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Locale, getDictionary, getTranslations } from '@/lib/i18n';
import { GraduationCap, Trophy, CalendarDays, Image, Users, ChevronRight } from 'lucide-react';

interface SchoolSectionProps {
  locale: Locale;
}

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  approvedAt: string | null;
}

interface SchoolEvent {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  date: string;
  time: string | null;
}

export default function SchoolSection({ locale }: SchoolSectionProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [achievementsRes, eventsRes] = await Promise.all([
          fetch('/api/school/public-achievements'),
          fetch('/api/school/public-events'),
        ]);
        const achievementsData = await achievementsRes.json();
        const eventsData = await eventsRes.json();
        setAchievements(Array.isArray(achievementsData) ? achievementsData : []);
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (error) {
        console.error('Failed to fetch school data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-32 relative bg-[#FAF9F6] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="w-32 h-4 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse" />
            <div className="w-64 h-10 bg-gray-200 rounded-xl mx-auto mb-4 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (achievements.length === 0 && events.length === 0) {
    return null;
  }

  return (
    <section className="py-32 relative bg-[#FAF9F6] overflow-hidden" id="school">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-blue-500/20">
            Education Hub
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] mb-6 uppercase tracking-tighter">
            <GraduationCap className="w-10 h-10 inline-block text-blue-500 mr-3" />
            MPPS <span className="text-blue-500">Mallaram</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto font-medium">
            Mandal Parishad Primary School — Nursey to 5th Class. Shaping young minds with quality education.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Achievements */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-black text-[#0A0A0A] uppercase tracking-widest">Our Achievements</h3>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-auto">{achievements.length} Achievements</span>
            </div>

            {achievements.length === 0 ? (
              <div className="text-center py-12 text-gray-300 font-bold italic">No achievements published yet</div>
            ) : (
              <div className="space-y-5">
                {achievements.map((achievement, i) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="group flex gap-5 p-6 bg-white rounded-[2.5rem] border border-gray-100 hover:border-blue-300 transition-all duration-500 shadow-sm hover:shadow-lg"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-blue-50 flex items-center justify-center">
                      {achievement.imageUrl ? (
                        <img src={achievement.imageUrl} alt={achievement.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <Trophy className="w-8 h-8 text-blue-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                          {achievement.approvedAt ? new Date(achievement.approvedAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-[#0A0A0A] mb-1 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">{achievement.title}</h4>
                      {achievement.description && (
                        <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2">{achievement.description}</p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0 self-center" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Upcoming Events */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <CalendarDays className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-black text-[#0A0A0A] uppercase tracking-widest">Upcoming Events</h3>
              <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest ml-auto">{events.length} Events</span>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-12 text-gray-300 font-bold italic">No upcoming events</div>
            ) : (
              <div className="space-y-4">
                {events.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="group flex gap-4 p-5 bg-white rounded-[2rem] border border-gray-100 hover:border-purple-300 transition-all duration-500 shadow-sm"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-purple-50 flex items-center justify-center">
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <CalendarDays className="w-6 h-6 text-purple-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-[#0A0A0A] mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">{event.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                        <span>📅 {event.date}</span>
                        {event.time && <span>⏰ {event.time}</span>}
                      </div>
                      {event.description && (
                        <p className="text-[11px] text-gray-400 font-medium mt-1 line-clamp-1">{event.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* School Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[2.5rem] text-white shadow-xl"
            >
              <GraduationCap className="w-10 h-10 mb-4 opacity-80" />
              <h4 className="text-lg font-black mb-2">MPPS Mallaram</h4>
              <p className="text-sm text-blue-100 font-medium mb-4">Anganwadi to 5th Class</p>
              <div className="space-y-2 text-[11px] text-blue-100 font-medium">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  <span>Admissions Open — Apply Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Quality Primary Education</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
