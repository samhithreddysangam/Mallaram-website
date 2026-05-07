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

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { status, name, phone } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Update booking status
    if (status) {
      const booking = await prisma.booking.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json(booking);
    }

    // Update user details (if provided)
    if (name || phone) {
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: { user: true },
      });

      if (booking) {
        await prisma.user.update({
          where: { id: booking.userId },
          data: {
            ...(name && { name }),
            ...(phone && { phone }),
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Get booking to decrement slot count
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (booking) {
      // Decrement slot count
      await prisma.slot.update({
        where: { id: booking.slotId },
        data: { currentBookings: { decrement: 1 } },
      });
    }

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
