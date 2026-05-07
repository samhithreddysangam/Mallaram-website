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
      nodeEnv: process.env.NODE_ENV,
    }
  };

  try {
    // Check DB connection
    await prisma.$queryRaw`SELECT 1`;
    status.database = 'connected';

    // Check Admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'arpitha@mallaram.in' }
    });

    if (admin) {
      status.adminUser = 'found';
      status.adminRole = admin.role;
    } else {
      status.adminUser = 'not found';
    }

  } catch (error: any) {
    status.database = 'error';
    status.error = error.message;
  }

  return NextResponse.json(status);
}
