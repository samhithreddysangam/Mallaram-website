import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;
    const profile = user.role === 'PRINCIPAL'
      ? await prisma.schoolProfile.findFirst({
          select: { id: true, schoolName: true, address: true, phone: true, email: true, userId: true },
        })
      : await prisma.schoolProfile.findUnique({
          where: { userId: user.id },
          select: { id: true, schoolName: true, address: true, phone: true, email: true, userId: true },
        });

    if (!profile) {
      return NextResponse.json({ error: 'School profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Failed to fetch school profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
