import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, phone, aadhaar, slotId } = await request.json();

    if (!phone || !slotId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Find or Create User (Farmer)
    const user = await prisma.user.upsert({
      where: { phone },
      update: { name }, // Update name if it changed
      create: {
        phone,
        name,
        password: 'PUBLIC_ACCESS', // Placeholder for public farmers
        role: 'FARMER',
      },
    });

    // 2. Check if slot is full
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    if (slot.currentBookings >= slot.capacity) {
      return NextResponse.json({ error: 'Slot is full' }, { status: 400 });
    }

    // 3. Create booking and increment slot count atomically
    const booking = await prisma.$transaction(async (tx: any) => {
      const b = await tx.booking.create({
        data: {
          userId: user.id,
          slotId,
          status: 'PENDING',
          qrCode: `IKP-${phone.slice(-4)}-${Date.now().toString().slice(-6)}`,
        },
      });

      await tx.slot.update({
        where: { id: slotId },
        data: {
          currentBookings: { increment: 1 },
        },
      });

      return b;
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const phone = searchParams.get('phone');

  try {
    let where: any = {};
    if (userId) where.userId = userId;
    if (phone) where.user = { phone };

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        slot: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
