'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Locale, getDictionary } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';

export default function LoginPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  
  const rawLocale = params?.locale;
  const locale = (Array.isArray(rawLocale) ? rawLocale[0] : rawLocale) as Locale || 'en';
  
  const dictionary = getDictionary(locale);
  const { auth } = dictionary;

  const urlError = searchParams.get('error');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      const userRole = (session?.user as any)?.role;
      const targetPath = userRole === 'ADMIN' ? `/${locale}/dashboard/admin` : `/${locale}/ikp-booking`;
      router.replace(targetPath);
    }
  }, [status, session, locale, router]);

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
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError(auth.error);
        } else {
          setError('Invalid login credentials. Please try again.');
        }
      } else {
        // Successful login, middleware or useEffect will handle redirection
        // but let's be explicit here to avoid waiting for next render
        window.location.reload(); // Refresh to ensure session is picked up
      }
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
                  <Mail className="text-xl" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com or phone"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary/50 ml-1">
                {auth.password}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors">
                  <Lock className="text-xl" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="text-xl" /> : <Eye className="text-xl" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                  {auth.signIn}
                </>
              )}
            </button>

            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <button 
                type="button"
                onClick={() => setShowDebug(!showDebug)}
                className="text-primary/40 hover:text-primary text-xs uppercase tracking-widest font-bold transition-colors underline decoration-dotted"
              >
                {showDebug ? 'Hide Diagnostics' : 'Login Issues? Click here'}
              </button>
              
              {showDebug && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl text-left text-[10px] font-mono space-y-2 border border-gray-200">
                  <p className="text-primary font-bold">Technical Help:</p>
                  <p>Status: {String(status)}</p>
                  <p>Role: {String((session as any)?.user?.role || 'None')}</p>
                  <p>Locale: {String(locale)}</p>
                  <div className="pt-2 flex gap-2">
                    <a href="/api/diagnostic" target="_blank" className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 no-underline">Check My Account</a>
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
