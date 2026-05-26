import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const records = await prisma.villagePerformance.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching village performance:', error);
    return NextResponse.json({ error: 'Failed to fetch village performance' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { label, value, percentage, order } = await request.json();
    if (!label || !value) {
      return NextResponse.json({ error: 'Label and value are required' }, { status: 400 });
    }
    const record = await prisma.villagePerformance.create({
      data: {
        label,
        value,
        percentage: percentage ?? 85,
        order: order || 0,
      },
    });
    return NextResponse.json(record);
  } catch (error) {
    console.error('Error creating village performance:', error);
    return NextResponse.json({ error: 'Failed to create village performance' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { label, value, percentage, order } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const record = await prisma.villagePerformance.update({
      where: { id },
      data: { label, value, percentage, order },
    });
    return NextResponse.json(record);
  } catch (error) {
    console.error('Error updating village performance:', error);
    return NextResponse.json({ error: 'Failed to update village performance' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await prisma.villagePerformance.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting village performance:', error);
    return NextResponse.json({ error: 'Failed to delete village performance' }, { status: 500 });
  }
}
