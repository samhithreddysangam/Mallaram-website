import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const records = await prisma.fundUsage.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error('Failed to fetch fund usage records:', error);
    return NextResponse.json({ error: 'Failed to fetch fund usage records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { label, amount, description, date, category } = body;

    if (!label || amount === undefined) {
      return NextResponse.json({ error: 'Label and amount are required' }, { status: 400 });
    }

    const record = await prisma.fundUsage.create({
      data: {
        label,
        amount: parseFloat(amount),
        description: description || null,
        date: date ? new Date(date) : new Date(),
        category: category || null,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Failed to create fund usage record:', error);
    return NextResponse.json({ error: 'Failed to create fund usage record' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, label, amount, description, date, category } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const record = await prisma.fundUsage.update({
      where: { id },
      data: {
        ...(label !== undefined && { label }),
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(category !== undefined && { category }),
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Failed to update fund usage record:', error);
    return NextResponse.json({ error: 'Failed to update fund usage record' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.fundUsage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete fund usage record:', error);
    return NextResponse.json({ error: 'Failed to delete fund usage record' }, { status: 500 });
  }
}
