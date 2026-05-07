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

        try {
          // Find user by email OR phone (allowing phone login in the email field)
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: identifier },
                { phone: identifier },
              ],
            },
          });

          if (!user) {
            console.log('Status: User not found in DB');
            return null;
          }

          console.log('User found:', user.email || user.phone, 'Role:', user.role);

          // Direct comparison as currently implemented in the seed/user flow
          const passwordsMatch = password === user.password;
          console.log('Password Match:', passwordsMatch);

          if (passwordsMatch) {
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
          console.error('Database/Supabase Error:', error.message);
          throw error;
        }

        return null;
      },
    }),
  ],
  // Use session callbacks to persist the role to the client side
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
});
