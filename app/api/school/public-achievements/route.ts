import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const achievements = await prisma.schoolAchievement.findMany({
      where: { status: 'APPROVED' },
      orderBy: { approvedAt: 'desc' },
      take: 30,
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Failed to fetch public achievements:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}
