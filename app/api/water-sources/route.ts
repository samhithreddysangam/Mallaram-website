import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sources = await prisma.waterSource.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(sources);
  } catch (error) {
    console.error('Error fetching water sources:', error);
    return NextResponse.json({ error: 'Failed to fetch water sources' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { label, level, status, icon, order } = await request.json();
    if (!label) {
      return NextResponse.json({ error: 'Label is required' }, { status: 400 });
    }
    const source = await prisma.waterSource.create({
      data: {
        label,
        level: level ?? 50,
        status: status || 'Normal',
        icon: icon || 'Droplets',
        order: order || 0,
      },
    });
    return NextResponse.json(source);
  } catch (error) {
    console.error('Error creating water source:', error);
    return NextResponse.json({ error: 'Failed to create water source' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { label, level, status, icon, order } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const source = await prisma.waterSource.update({
      where: { id },
      data: { label, level, status, icon, order },
    });
    return NextResponse.json(source);
  } catch (error) {
    console.error('Error updating water source:', error);
    return NextResponse.json({ error: 'Failed to update water source' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await prisma.waterSource.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting water source:', error);
    return NextResponse.json({ error: 'Failed to delete water source' }, { status: 500 });
  }
}
