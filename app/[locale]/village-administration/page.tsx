'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { Shield, ChevronRight, Building2, Users } from 'lucide-react';

interface VillageOfficial {
  id: string;
  name: string;
  title: string;
  imageUrl: string | null;
  description: string | null;
  order: number;
  active: boolean;
  createdAt: string;
}

export default function VillageAdministrationPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [officials, setOfficials] = useState<VillageOfficial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const res = await fetch('/api/village-officials');
        const data = await res.json();
        setOfficials(Array.isArray(data) ? data.filter((o: VillageOfficial) => o.active) : []);
      } catch (error) {
        console.error('Failed to fetch village officials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOfficials();
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <Navigation locale={locale} />

      <div className="pt-48 lg:pt-60 max-w-7xl mx-auto px-4 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-[#15803d]/20">
            <Building2 className="w-4 h-4" />
            Gram Panchayat
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-[#0A0A0A] mb-6 uppercase tracking-tighter">
            Village <span className="text-[#15803d]">Administration</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-medium text-lg">
            Meet the dedicated team working tirelessly for the development and welfare of Mallaram.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-2 border-[#15803d] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : officials.length === 0 ? (
          <div className="text-center py-32">
            <Shield className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-gray-300 uppercase tracking-tighter">No officials listed yet</h3>
            <p className="text-gray-300 font-medium mt-2">Village administration details are being updated.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {officials.map((official, i) => (
              <motion.div
                key={official.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-[#15803d]/30 transition-all duration-500 overflow-hidden"
              >
                {/* Photo */}
                <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                  {official.imageUrl ? (
                    <img
                      src={official.imageUrl}
                      alt={official.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#15803d]/5 to-[#15803d]/10">
                      <Users className="w-20 h-20 text-[#15803d]/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Info */}
                <div className="p-8">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#15803d]/10 text-[#15803d] text-[9px] font-black uppercase tracking-[0.15em] mb-4 border border-[#15803d]/20">
                    {official.title}
                  </div>
                  <h3 className="text-xl font-black text-[#0A0A0A] uppercase tracking-tighter leading-tight mb-3">
                    {official.name}
                  </h3>
                  {official.description && (
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {official.description}
                    </p>
                  )}
                </div>

                {/* Bottom accent line */}
                <div className="h-1 bg-gradient-to-r from-[#15803d]/0 via-[#15803d]/30 to-[#15803d]/0 group-hover:via-[#15803d]/60 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer locale={locale} />
    </main>
  );
}
