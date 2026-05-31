'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { Users, Shield, Building2, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface LocalBodySectionProps {
  locale: Locale;
}

interface LocalBodyMember {
  id: string;
  name: string;
  designation: string;
  imageUrl: string | null;
  description: string | null;
  category: string;
  ward: string | null;
  order: number;
  active: boolean;
}

function MemberImage({ member }: { member: LocalBodyMember }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-3 group"
    >
      <div className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.06)] border-2 border-gray-100 flex items-center justify-center overflow-hidden transform group-hover:scale-105 group-hover:border-[#15803d]/40 transition-all duration-500 bg-white">
        {member.imageUrl ? (
          <img 
            src={member.imageUrl} 
            alt={member.name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#15803d]/5 to-[#15803d]/10">
            <Users className="w-8 h-8 md:w-10 md:h-10 text-[#15803d]/30" />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center text-center">
        <span className="text-xs md:text-sm text-[#0A0A0A] font-black uppercase tracking-[0.1em] leading-tight max-w-[160px] md:max-w-[200px]">
          {member.name}
        </span>
        <span className="text-[9px] md:text-[11px] text-[#15803d] font-bold uppercase tracking-wider mt-0.5 leading-tight max-w-[160px] md:max-w-[200px]">
          {member.designation}
        </span>
        {member.description && (
          <p className="text-[10px] text-gray-400 font-medium mt-1 line-clamp-2 max-w-[160px] md:max-w-[200px]">
            {member.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function LocalBodySection({ locale }: LocalBodySectionProps) {
  const [secretary, setSecretary] = useState<LocalBodyMember | null>(null);
  const [wardMembers, setWardMembers] = useState<LocalBodyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('/api/local-body');
        const data = await res.json();
        const active = Array.isArray(data)
          ? data.filter((m: LocalBodyMember) => m.active).sort((a, b) => a.order - b.order)
          : [];
        
        const sec = active.find((m: LocalBodyMember) => m.category === 'secretary') || null;
        const wards = active.filter((m: LocalBodyMember) => m.category === 'ward_member');
        
        setSecretary(sec);
        setWardMembers(wards);
      } catch (error) {
        console.error('Failed to fetch local body members:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-16 md:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4 mb-12 animate-pulse">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-64 bg-gray-200 rounded" />
            <div className="h-4 w-48 bg-gray-100 rounded" />
          </div>
          <div className="flex justify-center gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gray-200" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-2 w-20 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!secretary && wardMembers.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 md:py-24 border-b border-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#15803d]/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-500/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-[#15803d]/20">
            <Building2 className="w-4 h-4" />
            Local Body
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#0A0A0A] mb-4 uppercase tracking-tighter">
            Gram Panchayat <span className="text-[#15803d]">Team</span>
          </h2>
          <p className="text-gray-500 font-medium text-sm md:text-base max-w-xl mx-auto">
            Meet the dedicated team serving the local administration of Mallaram
          </p>
        </motion.div>

        {/* Secretary Section */}
        {secretary && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-14"
          >
            <div className="group relative bg-gradient-to-b from-[#FAF9F6] to-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.03)] max-w-md w-full hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-500">
              <div className="flex flex-col items-center gap-5">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full shadow-lg border-2 border-[#15803d]/20 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                  {secretary.imageUrl ? (
                    <img 
                      src={secretary.imageUrl} 
                      alt={secretary.name}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#15803d]/10 to-[#15803d]/20">
                      <Shield className="w-12 h-12 md:w-16 md:h-16 text-[#15803d]/40" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#15803d]/10 text-[#15803d] text-[9px] font-black uppercase tracking-[0.15em] mb-3 border border-[#15803d]/20">
                    {secretary.designation}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#0A0A0A] uppercase tracking-tighter">
                    {secretary.name}
                  </h3>
                  {secretary.description && (
                    <p className="text-sm text-gray-500 font-medium mt-2 max-w-sm">
                      {secretary.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Ward Members Section */}
        {wardMembers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {wardMembers.length > 3 && (
              <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl font-black text-[#0A0A0A] uppercase tracking-tighter">
                  Ward <span className="text-[#15803d]">Members</span>
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Sarpanch & Ward Representatives
                </p>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              {wardMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex-shrink-0"
                >
                  <MemberImage member={member} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
