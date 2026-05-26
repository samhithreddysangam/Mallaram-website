import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const metrics = await prisma.villageMetric.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching village metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch village metrics' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { label, value, status, icon, color, bg, order } = await request.json();
    if (!label || !value) {
      return NextResponse.json({ error: 'Label and value are required' }, { status: 400 });
    }
    const metric = await prisma.villageMetric.create({
      data: {
        label,
        value,
        status: status || 'Active',
        icon: icon || 'Activity',
        color: color || 'text-green-500',
        bg: bg || 'bg-green-500/10',
        order: order || 0,
      },
    });
    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error creating village metric:', error);
    return NextResponse.json({ error: 'Failed to create village metric' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { label, value, status, icon, color, bg, order } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const metric = await prisma.villageMetric.update({
      where: { id },
      data: { label, value, status, icon, color, bg, order },
    });
    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error updating village metric:', error);
    return NextResponse.json({ error: 'Failed to update village metric' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await prisma.villageMetric.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting village metric:', error);
    return NextResponse.json({ error: 'Failed to delete village metric' }, { status: 500 });
  }
}
