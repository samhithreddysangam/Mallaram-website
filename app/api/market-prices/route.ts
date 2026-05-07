import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get('crop');

  try {
    const where = crop ? { cropName: crop } : {};
    
    // Get latest price for each crop
    const crops = await prisma.cropPrice.findMany({
      where,
      orderBy: { date: 'desc' },
      distinct: ['cropName'],
    });

    return NextResponse.json(crops);
  } catch (error) {
    console.error('Error fetching market prices:', error);
    return NextResponse.json({ error: 'Failed to fetch market prices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { cropName, price, unit, district } = await request.json();

    if (!cropName || !price) {
      return NextResponse.json({ error: 'Crop name and price are required' }, { status: 400 });
    }

    const newPrice = await prisma.cropPrice.create({
      data: {
        cropName,
        price: parseFloat(price),
        unit: unit || 'Quintal',
        district: district || 'Rajanna Sircilla',
        date: new Date(),
      },
    });

    return NextResponse.json(newPrice);
  } catch (error) {
    console.error('Error adding market price:', error);
    return NextResponse.json({ error: 'Failed to add market price' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { cropName, price, unit } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updatedPrice = await prisma.cropPrice.update({
      where: { id },
      data: {
        cropName,
        price: parseFloat(price),
        unit: unit || 'Quintal',
        date: new Date(),
      },
    });

    return NextResponse.json(updatedPrice);
  } catch (error) {
    console.error('Error updating market price:', error);
    return NextResponse.json({ error: 'Failed to update market price' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.cropPrice.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting market price:', error);
    return NextResponse.json({ error: 'Failed to delete market price' }, { status: 500 });
  }
}
