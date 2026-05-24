import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('API: Fetching schemes from database...');
    const schemes = await prisma.scheme.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log(`API: Found ${schemes.length} schemes`);
    return NextResponse.json(schemes);
  } catch (error) {
    console.error('Failed to fetch schemes:', error);
    return NextResponse.json({ error: 'Failed to fetch schemes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, link, description } = body;

    if (!title || !link) {
      return NextResponse.json({ error: 'Title and link are required' }, { status: 400 });
    }

    const scheme = await prisma.scheme.create({
      data: {
        title,
        link,
        description,
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
    const { id, title, link, description } = body;

    if (!id || !title || !link) {
      return NextResponse.json({ error: 'ID, title, and link are required' }, { status: 400 });
    }

    const scheme = await prisma.scheme.update({
      where: { id },
      data: {
        title,
        link,
        description,
      },
    });

    return NextResponse.json(scheme);
  } catch (error) {
    console.error('Failed to update scheme:', error);
    return NextResponse.json({ error: 'Failed to update scheme' }, { status: 500 });
  }
}
