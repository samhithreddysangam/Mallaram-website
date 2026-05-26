'use client';

import { Suspense, useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Locale, getDictionary } from '@/lib/i18n';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';

function LoginForm() {
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

  const getErrorMessage = (errKey: string | null) => {
    if (!errKey) return null;

    if (errKey === 'Configuration' || errKey.includes('Config') || errKey.includes('secret') || errKey.includes('500') || errKey.includes('MissingSecret')) {
      return (
        <div className="space-y-1.5 text-left w-full">
          <p className="font-extrabold text-red-700 text-sm flex items-center gap-1.5">
            ⚠️ Auth Server Misconfigured
          </p>
          <p className="text-xs text-red-600 font-bold leading-relaxed">
            The production deployment is missing the <code className="bg-red-100/80 px-1 py-0.5 rounded font-mono text-[10px]">AUTH_SECRET</code> environment variable.
          </p>
          <p className="text-[11px] text-red-500 font-semibold leading-relaxed">
            Please run <code className="bg-red-100/50 px-1 py-0.5 rounded font-mono">npx auth secret</code> and add it as <code className="bg-red-100/50 px-1 py-0.5 rounded font-mono">AUTH_SECRET</code> in your hosting settings (e.g. Vercel dashboard), then redeploy.
          </p>
        </div>
      );
    }

    if (errKey === 'CredentialsSignin' || errKey === 'CallbackRouteError') {
      return <span className="font-bold text-red-600">{auth.error || 'Invalid login credentials. Please try again.'}</span>;
    }

    return <span className="font-bold text-red-600">{errKey}</span>;
  };

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
        console.error('Sign in result error:', result.error);
        if (result.error === 'CredentialsSignin' || result.error === 'CallbackRouteError') {
          setError('CredentialsSignin');
        } else if (result.error === 'Configuration' || result.error.includes('Config')) {
          setError('Configuration');
        } else {
          setError(result.error);
        }
      } else {
        // Successful login, direct user to dashboard immediately
        const userRole = (session?.user as any)?.role;
        const targetPath = userRole === 'ADMIN' ? `/${locale}/dashboard/admin` : `/${locale}/ikp-booking`;
        router.replace(targetPath);
        // Fallback hard refresh to ensure session state updates
        setTimeout(() => {
          window.location.href = targetPath;
        }, 100);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errMsg = err?.message || '';
      if (errMsg.includes('Configuration') || errMsg.includes('secret') || errMsg.includes('MissingSecret')) {
        setError('Configuration');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
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
              className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse mt-1.5 shrink-0"></div>
              <div className="flex-1">
                {getErrorMessage(error || urlError)}
              </div>
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
                  <p className="text-primary font-bold">Deployment Diagnostics:</p>
                  <p>Session: {String(status)}</p>
                  <p>Role: {String((session as any)?.user?.role || 'None')}</p>
                  <p>Locale: {String(locale)}</p>
                  <p>Host: {typeof window !== 'undefined' ? window.location.host : 'SSR'}</p>
                  <p>AUTH_URL: {typeof window !== 'undefined' ? (window.location.origin !== 'http://localhost:3000' ? '⚠️ Check config' : '✓ Local') : 'SSR'}</p>
                  
                  <div className="pt-3 space-y-2">
                    <p className="text-primary font-bold">Common Fixes:</p>
                    <p className="text-gray-500">1. Ensure AUTH_URL points to your production domain</p>
                    <p className="text-gray-500">2. Ensure AUTH_SECRET is set (run: npx auth secret)</p>
                    <p className="text-gray-500">3. Verify admin user exists in production DB</p>
                    <p className="text-gray-500">4. Check <a href="/api/diagnostic" target="_blank" className="text-primary underline font-bold">/api/diagnostic</a> for config status</p>
                  </div>
                  
                  <div className="pt-2 flex gap-2">
                    <a href="/api/diagnostic" target="_blank" className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 no-underline font-bold">Run Diagnostics</a>
                    <button type="button" onClick={() => window.location.reload()} className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-bold">Reload Page</button>
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

export default function LoginPage() {
  const params = useParams();
  const rawLocale = params?.locale;
  const locale = (Array.isArray(rawLocale) ? rawLocale[0] : rawLocale) as Locale || 'en';
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#FDFBF7]">
        <Navigation locale={locale} />
        <div className="pt-32 pb-20 px-4 flex justify-center items-center min-h-[calc(100vh-80px)]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
