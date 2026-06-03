import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // If status is specified, filter by it (admin view). Otherwise return only APPROVED (public view)
    const where: any = {};
    if (status) {
      where.status = status;
    } else {
      where.status = 'APPROVED';
    }

    const schemes = await prisma.scheme.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json(schemes);
  } catch (error) {
    console.error('Failed to fetch schemes:', error);
    return NextResponse.json({ error: 'Failed to fetch schemes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, link, description, source, category, eligibility, benefits } = body;

    if (!title || !link) {
      return NextResponse.json({ error: 'Title and link are required' }, { status: 400 });
    }

    const scheme = await prisma.scheme.create({
      data: {
        title,
        link,
        description,
        source,
        category,
        eligibility,
        benefits,
        status: 'PENDING', // New schemes start as PENDING, admin must approve
      },
    });

    return NextResponse.json(scheme);
  } catch (error) {
    console.error('Failed to create scheme:', error);
    return NextResponse.json({ error: 'Failed to create scheme' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.scheme.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Scheme deleted successfully' });
  } catch (error) {
    console.error('Failed to delete scheme:', error);
    return NextResponse.json({ error: 'Failed to delete scheme' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, link, description, source, category, eligibility, benefits } = body;

    if (!id || !title || !link) {
      return NextResponse.json({ error: 'ID, title, and link are required' }, { status: 400 });
    }

    const scheme = await prisma.scheme.update({
      where: { id },
      data: {
        title,
        link,
        description,
        source,
        category,
        eligibility,
        benefits,
      },
    });

    return NextResponse.json(scheme);
  } catch (error) {
    console.error('Failed to update scheme:', error);
    return NextResponse.json({ error: 'Failed to update scheme' }, { status: 500 });
  }
}
