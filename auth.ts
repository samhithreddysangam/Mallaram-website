import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { prisma } from '@/lib/prisma';

const isDev = process.env.NODE_ENV === 'development';

const log = (...args: any[]) => {
  if (isDev) console.log(...args);
};

const logError = (...args: any[]) => {
  if (isDev) console.error(...args);
};

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  // debug is now controlled by authConfig (enabled only in development)
  providers: [
    Credentials({
      async authorize(credentials) {
        const identifier = credentials?.email as string;
        const password = credentials?.password as string;

        log('--- Auth Attempt ---');
        
        if (!identifier || !password) {
          log('Status: Missing credentials');
          return null;
        }

        const trimmedIdentifier = identifier.trim().toLowerCase();
        const passwordToMatch = password;

        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: trimmedIdentifier },
                { phone: trimmedIdentifier },
                { email: identifier.trim() },
                { phone: identifier.trim() },
              ],
            },
          });

          if (!user) {
            log('Status: User not found in DB');
            return null;
          }

          log('User found:', user.email || user.phone);

          const passwordsMatch = passwordToMatch === user.password;

          if (passwordsMatch) {
            log('Status: Auth success, Role:', user.role);
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          } else {
            log('Status: Password mismatch');
          }
        } catch (error: any) {
          logError('Database Error:', error.message);
          throw error;
        }

        return null;
      },
    }),
  ],
});
