import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n';

const { auth } = NextAuth(authConfig);

/**
 * Safely create a redirect URL that always uses the real request origin,
 * never localhost in production.
 */
function safeRedirect(path: string, req: NextRequest): NextResponse {
  const url = new URL(path, req.url);

  // Safety guard: if somehow the redirect URL resolved to localhost in production,
  // rewrite it to use the actual request host instead.
  if (
    process.env.NODE_ENV === 'production' &&
    (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
  ) {
    url.protocol = req.nextUrl.protocol || 'https:';
    url.hostname = req.nextUrl.hostname;
    url.port = req.nextUrl.port || '';
  }

  return NextResponse.redirect(url);
}

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // 1. Handle i18n Redirection
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = defaultLocale;
    // Don't redirect if it's an API route or static asset (though matcher should handle this)
    if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
      return NextResponse.next();
    }
    return safeRedirect(`/${locale}${pathname}`, req);
  }

  // 2. Handle Authentication & Authorization
  const locale = pathname.split('/')[1] || defaultLocale;
  const isOnDashboard = pathname.includes('/dashboard');
  const isOnAdminDashboard = pathname.includes('/dashboard/admin');
  const isOnLogin = pathname.includes('/login');
  
  // Extract user info from the session
  const user = req.auth?.user as any;
  const userRole = user?.role;

  console.log(`Middleware: ${pathname} | Auth: ${isLoggedIn} | Role: ${userRole}`);

  // Protect all dashboard routes
  if (isOnDashboard) {
    if (!isLoggedIn) {
      return safeRedirect(`/${locale}/login`, req);
    }
    
    // Specifically protect ADMIN dashboard
    if (isOnAdminDashboard && userRole !== 'ADMIN') {
      console.log('Middleware: Redirecting non-admin away from admin dashboard');
      return safeRedirect(`/${locale}/ikp-booking`, req);
    }
  }

  // Redirect to appropriate dashboard if logged in and trying to access login page
  if (isOnLogin && isLoggedIn && userRole) {
    if (userRole === 'ADMIN') {
      return safeRedirect(`/${locale}/dashboard/admin`, req);
    }
    return safeRedirect(`/${locale}/ikp-booking`, req);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next|favicon.ico|icon.jpg|icon.png|apple-icon.png|locales|images|assets).*)',
  ],
};

