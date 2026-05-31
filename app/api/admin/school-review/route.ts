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
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const [pendingAchievements, pendingEvents] = await Promise.all([
      prisma.schoolAchievement.findMany({
        where: { status: 'PENDING' },
        orderBy: { submittedAt: 'desc' },
        include: { school: { select: { schoolName: true } } },
      }),
      prisma.schoolEvent.findMany({
        where: { status: 'PENDING' },
        orderBy: { submittedAt: 'desc' },
        include: { school: { select: { schoolName: true } } },
      }),
    ]);

    const [approvedAchievements, approvedEvents] = await Promise.all([
      prisma.schoolAchievement.findMany({
        where: { status: 'APPROVED' },
        orderBy: { approvedAt: 'desc' },
        take: 20,
        include: { school: { select: { schoolName: true } } },
      }),
      prisma.schoolEvent.findMany({
        where: { status: 'APPROVED' },
        orderBy: { approvedAt: 'desc' },
        take: 20,
        include: { school: { select: { schoolName: true } } },
      }),
    ]);

    return NextResponse.json({
      pendingAchievements,
      pendingEvents,
      approvedAchievements,
      approvedEvents,
    });
  } catch (error) {
    console.error('Failed to fetch school review data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = session.user as any;
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { type, id, action, rejectionReason } = body;

    if (!type || !id || !action) {
      return NextResponse.json({ error: 'Missing required fields: type, id, action' }, { status: 400 });
    }

    if (type === 'achievement') {
      const achievement = await prisma.schoolAchievement.findUnique({ where: { id } });
      if (!achievement) {
        return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
      }

      if (action === 'approve') {
        const updated = await prisma.schoolAchievement.update({
          where: { id },
          data: { status: 'APPROVED', approvedAt: new Date(), reviewedBy: user.id, rejectionReason: null },
        });
        return NextResponse.json(updated);
      } else if (action === 'reject') {
        const updated = await prisma.schoolAchievement.update({
          where: { id },
          data: { status: 'REJECTED', reviewedBy: user.id, rejectionReason: rejectionReason || null },
        });
        return NextResponse.json(updated);
      }
    } else if (type === 'event') {
      const schoolEvent = await prisma.schoolEvent.findUnique({ where: { id } });
      if (!schoolEvent) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }

      if (action === 'approve') {
        const updated = await prisma.schoolEvent.update({
          where: { id },
          data: { status: 'APPROVED', approvedAt: new Date(), reviewedBy: user.id, rejectionReason: null },
        });
        return NextResponse.json(updated);
      } else if (action === 'reject') {
        const updated = await prisma.schoolEvent.update({
          where: { id },
          data: { status: 'REJECTED', reviewedBy: user.id, rejectionReason: rejectionReason || null },
        });
        return NextResponse.json(updated);
      }
    }

    return NextResponse.json({ error: 'Invalid type or action' }, { status: 400 });
  } catch (error) {
    console.error('Failed to process review:', error);
    return NextResponse.json({ error: 'Failed to process review' }, { status: 500 });
  }
}
