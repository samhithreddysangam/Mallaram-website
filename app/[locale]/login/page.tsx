'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Locale, getDictionary } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { motion } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const locale = (params?.locale as Locale) || 'en';
  const dictionary = getDictionary(locale);
  const { auth } = dictionary;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (status === 'authenticated') {
    const userRole = (session?.user as any)?.role;
    if (userRole === 'ADMIN') {
      router.push(`/${locale}/dashboard/admin`);
    } else {
      router.push(`/${locale}/ikp-booking`);
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(auth.error);
      } else {
        // Simple redirect to a landing route, middleware will handle the rest
        // Or we can just refresh to trigger the "already logged in" redirect at the top
        window.location.reload();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navigation locale={locale} />
      
      <div className="pt-40 lg:pt-48 flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-primary/5"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-primary-dark tracking-tighter mb-2">{auth.login}</h1>
            <p className="text-earth">{dictionary.common.appName}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-primary uppercase tracking-widest mb-2 px-1">
                {auth.email}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="arpitha@mallaram.in"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-primary uppercase tracking-widest mb-2 px-1">
                {auth.password}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-full font-black uppercase tracking-widest transition-all ${
                loading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-earth shadow-lg shadow-primary/20 active:scale-95'
              }`}
            >
              {loading ? '...' : auth.signIn}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-500">
              {auth.noAccount} <span className="text-primary font-bold cursor-pointer hover:underline">Contact Panchayat</span>
            </p>
          </div>
        </motion.div>
      </div>

      <Footer locale={locale} />
    </main>
  );
}
