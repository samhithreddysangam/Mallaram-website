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

    // Fetch all schemes grouped by status for admin review
    const [pendingSchemes, approvedSchemes, rejectedSchemes] = await Promise.all([
      prisma.scheme.findMany({
        where: { status: 'PENDING' },
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.scheme.findMany({
        where: { status: 'APPROVED' },
        orderBy: { submittedAt: 'desc' },
        take: 20,
      }),
      prisma.scheme.findMany({
        where: { status: 'REJECTED' },
        orderBy: { submittedAt: 'desc' },
        take: 20,
      }),
    ]);

    return NextResponse.json({
      pendingSchemes,
      approvedSchemes,
      rejectedSchemes,
      stats: {
        total: pendingSchemes.length + approvedSchemes.length + rejectedSchemes.length,
        pending: pendingSchemes.length,
        approved: approvedSchemes.length,
        rejected: rejectedSchemes.length,
      },
    });
  } catch (error) {
    console.error('Failed to fetch scheme review data:', error);
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
    const { id, action, rejectionReason } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing required fields: id, action' }, { status: 400 });
    }

    const scheme = await prisma.scheme.findUnique({ where: { id } });
    if (!scheme) {
      return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
    }

    if (action === 'approve') {
      const updated = await prisma.scheme.update({
        where: { id },
        data: {
          status: 'APPROVED',
          reviewedBy: user.id,
          reviewedAt: new Date(),
        },
      });
      return NextResponse.json(updated);
    } else if (action === 'reject') {
      const updated = await prisma.scheme.update({
        where: { id },
        data: {
          status: 'REJECTED',
          reviewedBy: user.id,
          reviewedAt: new Date(),
        },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Failed to process scheme review:', error);
    return NextResponse.json({ error: 'Failed to process review' }, { status: 500 });
  }
}
