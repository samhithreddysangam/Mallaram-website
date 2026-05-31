import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.schoolEvent.findMany({
      where: { status: 'APPROVED' },
      orderBy: { submittedAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch public school events:', error);
    return NextResponse.json({ error: 'Failed to fetch school events' }, { status: 500 });
  }
}
