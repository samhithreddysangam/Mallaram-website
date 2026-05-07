import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const status: any = {
    timestamp: new Date().toISOString(),
    database: 'unknown',
    adminUser: 'unknown',
    env: {
      hasAuthSecret: !!process.env.AUTH_SECRET,
      hasAuthUrl: !!process.env.AUTH_URL,
      authUrl: process.env.AUTH_URL || 'not set',
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasDirectUrl: !!process.env.DIRECT_URL,
      nodeEnv: process.env.NODE_ENV,
    }
  };

  try {
    // Check DB connection
    await prisma.$queryRaw`SELECT 1`;
    status.database = 'connected';

    // Check Admin user by email
    const admin = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'arpitha@mallaram.in' },
          { role: 'ADMIN' }
        ]
      }
    });

    if (admin) {
      status.adminUser = 'found';
      status.adminEmail = admin.email;
      status.adminPhone = admin.phone;
      status.adminRole = admin.role;
      status.passwordLength = admin.password?.length || 0;
    } else {
      status.adminUser = 'not found';
    }

    // Check for any users
    const userCount = await prisma.user.count();
    status.totalUsers = userCount;

  } catch (error: any) {
    status.database = 'error';
    status.error = error.message;
  }

  return NextResponse.json(status);
}
