import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function GET() {
  try {
    const events = await prisma.villageEvent.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      // Handle form data with image upload
      const formData = await request.formData();
      const title = formData.get('title') as string;
      const description = formData.get('description') as string | null;
      const date = formData.get('date') as string;
      const category = formData.get('category') as string | null;
      const order = parseInt(formData.get('order') as string) || 0;
      const active = formData.get('active') !== 'false';
      const file = formData.get('image') as File | null;

      if (!title || !date) {
        return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
      }

      let imageUrl: string | null = null;

      if (file && file.size > 0) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' }, { status: 400 });
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          return NextResponse.json({ error: 'File too large. Max 10MB' }, { status: 400 });
        }

        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `event-${crypto.randomUUID()}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'events');
        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        imageUrl = `/images/events/${filename}`;
      }

      const event = await prisma.villageEvent.create({
        data: {
          title,
          description: description || null,
          imageUrl,
          date,
          category: category || 'local',
          order,
          active,
        },
      });

      return NextResponse.json(event);
    } else {
      // Handle JSON body (text-only, no image)
      const body = await request.json();
      const { title, description, imageUrl, date, category, order, active } = body;

      if (!title || !date) {
        return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
      }

      const event = await prisma.villageEvent.create({
        data: {
          title,
          description: description || null,
          imageUrl: imageUrl || null,
          date,
          category: category || 'local',
          order: order || 0,
          active: active !== false,
        },
      });

      return NextResponse.json(event);
    }
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const title = formData.get('title') as string | null;
      const description = formData.get('description') as string | null;
      const date = formData.get('date') as string | null;
      const category = formData.get('category') as string | null;
      const order = formData.get('order') ? parseInt(formData.get('order') as string) : undefined;
      const active = formData.get('active') !== undefined ? formData.get('active') !== 'false' : undefined;
      const file = formData.get('image') as File | null;
      const removeImage = formData.get('removeImage') === 'true';

      const data: any = {};
      if (title) data.title = title;
      if (description !== null) data.description = description;
      if (date) data.date = date;
      if (category) data.category = category;
      if (order !== undefined) data.order = order;
      if (active !== undefined) data.active = active;

      if (removeImage) {
        const existing = await prisma.villageEvent.findUnique({ where: { id } });
        if (existing?.imageUrl) {
          const oldFilepath = path.join(process.cwd(), 'public', existing.imageUrl);
          try { await unlink(oldFilepath); } catch (e) { /* ignore */ }
        }
        data.imageUrl = null;
      }

      if (file && file.size > 0) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          return NextResponse.json({ error: 'File too large. Max 10MB' }, { status: 400 });
        }

        // Delete old image
        const existing = await prisma.villageEvent.findUnique({ where: { id } });
        if (existing?.imageUrl) {
          const oldFilepath = path.join(process.cwd(), 'public', existing.imageUrl);
          try { await unlink(oldFilepath); } catch (e) { /* ignore */ }
        }

        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `event-${crypto.randomUUID()}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'events');
        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        data.imageUrl = `/images/events/${filename}`;
      }

      const event = await prisma.villageEvent.update({
        where: { id },
        data,
      });

      return NextResponse.json(event);
    } else {
      const body = await request.json();
      const { title, description, imageUrl, date, category, order, active } = body;

      const data: Record<string, any> = {};
      if (title !== undefined) data.title = title;
      if (description !== undefined) data.description = description;
      if (imageUrl !== undefined) data.imageUrl = imageUrl;
      if (date !== undefined) data.date = date;
      if (category !== undefined) data.category = category;
      if (order !== undefined) data.order = order;
      if (active !== undefined) data.active = active;

      const event = await prisma.villageEvent.update({
        where: { id },
        data,
      });

      return NextResponse.json(event);
    }
  } catch (error) {
    console.error('Failed to update event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const event = await prisma.villageEvent.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Delete image from disk if it exists
    if (event.imageUrl) {
      const filepath = path.join(process.cwd(), 'public', event.imageUrl);
      try { await unlink(filepath); } catch (e) { /* ignore */ }
    }

    await prisma.villageEvent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
