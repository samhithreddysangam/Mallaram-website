import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const now = new Date();
    
    // Find all PENDING or APPROVED bookings that have a slot date in the past
    const pastBookings = await prisma.booking.updateMany({
      where: {
        status: { in: ['PENDING', 'APPROVED'] },
        slot: {
          date: { lt: new Date(now.setHours(0, 0, 0, 0)) }
        }
      },
      data: {
        status: 'EXPIRED'
      }
    });

    return NextResponse.json({ 
      success: true, 
      expiredCount: pastBookings.count 
    });
  } catch (error) {
    console.error('Error expiring bookings:', error);
    return NextResponse.json({ error: 'Failed to expire bookings' }, { status: 500 });
  }
}
