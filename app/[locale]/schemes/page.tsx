'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { ExternalLink, ArrowRight, Loader2, Landmark, Users, IndianRupee, BadgeCheck } from 'lucide-react';

interface Scheme {
  id: string;
  title: string;
  link: string;
  description: string | null;
  source: string | null;
  category: string | null;
  eligibility: string | null;
  benefits: string | null;
}

export default function SchemesPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

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

  const categories = ['all', ...new Set(schemes.map((s) => s.category || 'Other').filter(Boolean))];
  const filtered = filter === 'all' ? schemes : schemes.filter((s) => (s.category || 'Other') === filter);

  const sourceColor = (source: string | null) => {
    switch (source) {
      case 'CENTRAL': return { badge: 'bg-blue-100 text-blue-700', label: 'Central Govt' };
      case 'STATE': return { badge: 'bg-purple-100 text-purple-700', label: 'State Govt' };
      case 'LOCAL': return { badge: 'bg-emerald-100 text-emerald-700', label: 'Local Body' };
      default: return { badge: 'bg-gray-100 text-gray-600', label: 'Government' };
    }
  };

  const categoryIcon = (category: string | null) => {
    switch (category) {
      case 'Agriculture': return '🌾';
      case 'Education': return '📚';
      case 'Health': return '🏥';
      case 'Social Welfare': return '🤝';
      case 'Housing': return '🏠';
      case 'Infrastructure': return '🏗️';
      case 'Employment': return '💼';
      case 'Digital Services': return '💻';
      default: return '📋';
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <Navigation locale={locale} />
      
      <div className="pt-40 lg:pt-48 pb-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight mb-4">
            Government Schemes
          </h1>
          <p className="text-lg text-earth-dark/70 max-w-2xl mx-auto">
            Access essential government services and welfare schemes directly from our village portal.
          </p>
        </motion.div>

        {/* Category Filters */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 justify-center mb-10"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white text-earth-dark/60 border border-primary/10 hover:border-primary/30'
                }`}
              >
                {cat === 'all' ? 'All Schemes' : `${categoryIcon(cat)} ${cat}`}
              </button>
            ))}
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-primary/10">
            <p className="text-earth-dark/50 font-bold italic">No schemes available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((scheme, index) => {
              const src = sourceColor(scheme.source);
              return (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <ExternalLink className="w-7 h-7" />
                        </div>
                        {scheme.category && (
                          <span className="text-2xl">{categoryIcon(scheme.category)}</span>
                        )}
                      </div>
                      {scheme.source && (
                        <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${src.badge}`}>
                          {src.label}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-black text-primary mb-2 leading-tight">
                      {scheme.title}
                    </h3>
                    
                    {scheme.description && (
                      <p className="text-earth-dark/70 mb-4 text-sm leading-relaxed">
                        {scheme.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      {scheme.eligibility && (
                        <div className="flex items-start gap-2 text-[10px] text-earth-dark/60">
                          <Users className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary/40" />
                          <span className="font-medium">{scheme.eligibility}</span>
                        </div>
                      )}
                      {scheme.benefits && (
                        <div className="flex items-start gap-2 text-[10px] text-earth-dark/60">
                          <IndianRupee className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary/40" />
                          <span className="font-medium">{scheme.benefits}</span>
                        </div>
                      )}
                    </div>

                    {scheme.category && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest">
                        <BadgeCheck className="w-3 h-3" />
                        {scheme.category}
                      </span>
                    )}
                  </div>
                  
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest hover:gap-3 transition-all group"
                  >
                    Visit Portal
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Footer locale={locale} />
    </main>
  );
}
