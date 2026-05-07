import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');
  const all = searchParams.get('all') === 'true';

  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let where: any = {};

    if (dateStr) {
      where.date = {
        gte: new Date(dateStr),
        lt: new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000)
      };
    } else if (!all) {
      where.date = { gte: now };
    }

    const slots = await prisma.slot.findMany({
      where,
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ],
    });

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { date, startTime, endTime, capacity, location } = await request.json();

    if (!date || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slot = await prisma.slot.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
        capacity: parseInt(capacity) || 10,
        location: location || "IKP Centre Mallaram",
      },
    });

    return NextResponse.json(slot);
  } catch (error) {
    console.error('Error creating slot:', error);
    return NextResponse.json({ error: 'Failed to create slot' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing slot ID' }, { status: 400 });
    }

    await prisma.slot.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting slot:', error);
    return NextResponse.json({ error: 'Failed to delete slot' }, { status: 500 });
  }
}
