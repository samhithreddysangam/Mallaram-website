import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const records = await prisma.fundAllocation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error('Failed to fetch fund allocations:', error);
    return NextResponse.json({ error: 'Failed to fetch fund allocations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { totalAmount, source, fiscalYear, description } = body;

    if (totalAmount === undefined) {
      return NextResponse.json({ error: 'Total amount is required' }, { status: 400 });
    }

    const record = await prisma.fundAllocation.create({
      data: {
        totalAmount: parseFloat(totalAmount),
        source: source || null,
        fiscalYear: fiscalYear || '2025-2026',
        description: description || null,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Failed to create fund allocation:', error);
    return NextResponse.json({ error: 'Failed to create fund allocation' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, totalAmount, source, fiscalYear, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const record = await prisma.fundAllocation.update({
      where: { id },
      data: {
        ...(totalAmount !== undefined && { totalAmount: parseFloat(totalAmount) }),
        ...(source !== undefined && { source }),
        ...(fiscalYear !== undefined && { fiscalYear }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Failed to update fund allocation:', error);
    return NextResponse.json({ error: 'Failed to update fund allocation' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.fundAllocation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete fund allocation:', error);
    return NextResponse.json({ error: 'Failed to delete fund allocation' }, { status: 500 });
  }
}
