import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const farmers = await prisma.farmerEnrollment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(farmers);
  } catch (error) {
    console.error('Failed to fetch farmers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch farmers' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Farmer ID is required' }, { status: 400 });
    }

    await prisma.farmerEnrollment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete farmer:', error);
    return NextResponse.json(
      { error: 'Failed to delete farmer' },
      { status: 500 }
    );
  }
}
