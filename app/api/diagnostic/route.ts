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

    // Check if new Prisma models are available
    status.prismaModels = Object.getOwnPropertyNames(prisma)
      .filter(k => !k.startsWith('_') && !k.startsWith('$') && typeof (prisma as any)[k] === 'object' && (prisma as any)[k]?.findMany)
      .join(', ');
    status.hasGalleryModel = !!(prisma as any).galleryImage;
    status.hasFundUsageModel = !!(prisma as any).fundUsage;

    // Try querying gallery images
    try {
      const galleryCount = await (prisma as any).galleryImage?.count();
      status.galleryCount = galleryCount;
    } catch (e: any) {
      status.galleryQueryError = e.message;
    }

    // Try querying fund usage
    try {
      const fundCount = await (prisma as any).fundUsage?.count();
      status.fundCount = fundCount;
    } catch (e: any) {
      status.fundQueryError = e.message;
    }

  } catch (error: any) {
    status.database = 'error';
    status.error = error.message;
  }

  return NextResponse.json(status);
}
