import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { prisma } from '@/lib/prisma';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const identifier = credentials?.email as string;
        const password = credentials?.password as string;

        console.log('--- Auth Attempt ---');
        console.log('Identifier:', identifier);
        
        if (!identifier || !password) {
          console.log('Status: Missing credentials');
          return null;
        }

        const trimmedIdentifier = identifier.trim().toLowerCase();
        const trimmedPassword = password.trim();

        try {
          // Find user by email OR phone (allowing phone login in the email field)
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: trimmedIdentifier },
                { phone: trimmedIdentifier },
                // Also check original just in case
                { email: identifier.trim() },
                { phone: identifier.trim() },
              ],
            },
          });

          if (!user) {
            console.log('Status: User not found in DB');
            return null;
          }

          console.log('User found:', user.email || user.phone);
          console.log('User Role in DB:', user.role);

          // Direct comparison as currently implemented in the seed/user flow
          const passwordsMatch = trimmedPassword === user.password;
          console.log('Password Match:', passwordsMatch);

          if (passwordsMatch) {
            console.log('Status: Success, Role:', user.role);
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          } else {
            console.log('Status: Password mismatch');
          }
        } catch (error: any) {
          console.error('Database/Prisma Error:', error.message);
          throw error;
        }

        return null;
      },
    }),
  ],
  // Use callbacks from authConfig
});
