import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n';

const { auth } = NextAuth(authConfig);

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
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, req.url)
    );
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
      return NextResponse.redirect(new URL(`/${locale}/login`, nextUrl));
    }
    
    // Specifically protect ADMIN dashboard
    if (isOnAdminDashboard && userRole !== 'ADMIN') {
      console.log('Middleware: Redirecting non-admin away from admin dashboard');
      return NextResponse.redirect(new URL(`/${locale}/ikp-booking`, nextUrl));
    }
  }

  // Redirect to appropriate dashboard if logged in and trying to access login page
  if (isOnLogin && isLoggedIn && userRole) {
    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL(`/${locale}/dashboard/admin`, nextUrl));
    }
    return NextResponse.redirect(new URL(`/${locale}/ikp-booking`, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next|favicon.ico|icon.jpg|icon.png|apple-icon.png|locales|images|assets).*)',
  ],
};
