'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Locale, getDictionary } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { motion } from 'framer-motion';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineArrowRight, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { signIn, useSession } from 'next-auth/react';

export default function LoginPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const locale = (params?.locale as Locale) || 'en';
  const dictionary = getDictionary(locale);
  const { auth } = dictionary;

  const urlError = searchParams.get('error');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Redirect if already logged in
  if (status === 'authenticated') {
    const userRole = (session?.user as any)?.role;
    const targetPath = userRole === 'ADMIN' ? `/${locale}/dashboard/admin` : `/${locale}/ikp-booking`;
    
    // Using window.location to ensure a full refresh and avoid hydration/middleware issues
    if (typeof window !== 'undefined') {
      window.location.href = targetPath;
    }
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-bold animate-pulse">Checking session...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use redirect: true (default) for better production reliability
      await signIn('credentials', {
        email,
        password,
        callbackUrl: `/${locale}/dashboard/admin`,
      });
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      <Navigation locale={locale} />
      
      <div className="pt-32 pb-20 px-4 flex justify-center items-center min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-primary/5"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-primary-dark tracking-tighter mb-2">{auth.login}</h1>
            <p className="text-earth">{dictionary.common.appName}</p>
          </div>

          {(error || urlError) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
              {urlError === 'CredentialsSignin' ? auth.error : (error || auth.error)}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary/50 ml-1">
                {auth.email}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors">
                  <HiOutlineEnvelope className="text-xl" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="arpitha@mallaram.in"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary/50 ml-1">
                {auth.password}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors">
                  <HiOutlineLockClosed className="text-xl" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary transition-colors"
                >
                  {showPassword ? <HiOutlineEyeSlash className="text-xl" /> : <HiOutlineEye className="text-xl" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <HiOutlineArrowRight className="text-xl" />
                  {auth.signIn}
                </>
              )}
            </button>

            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <button 
                type="button"
                onClick={() => setShowDebug(!showDebug)}
                className="text-primary/40 hover:text-primary text-xs uppercase tracking-widest font-bold transition-colors"
              >
                {showDebug ? 'Hide Diagnostics' : 'Login Issues? Click here'}
              </button>
              
              {showDebug && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl text-left text-[10px] font-mono space-y-2 border border-gray-200">
                  <p className="text-primary font-bold">Diagnostics:</p>
                  <p>Status: {status}</p>
                  <p>Role: {(session?.user as any)?.role || 'None'}</p>
                  <p>Locale: {locale}</p>
                  <div className="pt-2 flex gap-2">
                    <a href="/api/diagnostic" target="_blank" className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">Check DB User</a>
                    <button type="button" onClick={() => window.location.reload()} className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">Reload Page</button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </motion.div>
      </div>

      <Footer locale={locale} />
    </main>
  );
}
