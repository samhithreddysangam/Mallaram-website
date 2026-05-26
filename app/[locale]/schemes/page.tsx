'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { ExternalLink, ArrowRight, Loader2 } from 'lucide-react';

interface Scheme {
  id: string;
  title: string;
  link: string;
  description: string | null;
}

export default function SchemesPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await fetch('/api/schemes');
        const data = await res.json();
        setSchemes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch schemes:', error);
        setSchemes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <Navigation locale={locale} />
      
      <div className="pt-40 lg:pt-48 pb-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight mb-4">
            Government Schemes
          </h1>
          <p className="text-lg text-earth-dark/70 max-w-2xl mx-auto">
            Access essential government services and welfare schemes directly from our village portal.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : schemes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-primary/10">
            <p className="text-earth-dark/50 font-bold italic">No schemes added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schemes.map((scheme, index) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <ExternalLink className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-primary mb-3 leading-tight">
                    {scheme.title}
                  </h3>
                  {scheme.description && (
                    <p className="text-earth-dark/70 mb-6 text-sm leading-relaxed">
                      {scheme.description}
                    </p>
                  )}
                </div>
                
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest hover:gap-3 transition-all"
                >
                  Visit Portal
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer locale={locale} />
    </main>
  );
}
