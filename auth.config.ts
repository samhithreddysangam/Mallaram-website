import type { NextAuthConfig } from 'next-auth';

// IMPORTANT for Production Deployment:
// 1. Set AUTH_URL to your actual deployed domain (e.g., https://mallaram.vercel.app)
// 2. Run `npx auth secret` and set AUTH_SECRET to the generated value
// 3. Ensure DATABASE_URL & DIRECT_URL point to your production database
// 4. Run `npx prisma db seed` on production to create the admin user

export const authConfig = {
  pages: {
    // Note: The middleware handles locale redirection (/login -> /en/login)
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  providers: [], // Add providers in auth.ts as some are not edge-compatible
} satisfies NextAuthConfig;
