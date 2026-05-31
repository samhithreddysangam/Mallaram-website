import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;
    const schoolProfile = user.role === 'PRINCIPAL'
      ? await prisma.schoolProfile.findFirst()
      : await prisma.schoolProfile.findUnique({ where: { userId: user.id } });

    if (!schoolProfile) {
      return NextResponse.json({ error: 'School profile not found' }, { status: 404 });
    }

    const events = await prisma.schoolEvent.findMany({
      where: { schoolId: schoolProfile.id },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch school events:', error);
    return NextResponse.json({ error: 'Failed to fetch school events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== 'SCHOOL' && user.role !== 'PRINCIPAL') {
      return NextResponse.json({ error: 'Only school users can submit events' }, { status: 403 });
    }

    const schoolProfile = user.role === 'PRINCIPAL'
      ? await prisma.schoolProfile.findFirst()
      : await prisma.schoolProfile.findUnique({ where: { userId: user.id } });

    if (!schoolProfile) {
      return NextResponse.json({ error: 'School profile not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const title = formData.get('title') as string;
      const description = formData.get('description') as string | null;
      const date = formData.get('date') as string;
      const time = formData.get('time') as string | null;
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
        const filename = `school-event-${crypto.randomUUID()}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'school');
        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        imageUrl = `/images/school/${filename}`;
      }

      const event = await prisma.schoolEvent.create({
        data: {
          title,
          description: description || null,
          date,
          time: time || null,
          imageUrl,
          schoolId: schoolProfile.id,
        },
      });

      return NextResponse.json(event);
    } else {
      const body = await request.json();
      const { title, description, date, time, imageUrl } = body;

      if (!title || !date) {
        return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
      }

      const event = await prisma.schoolEvent.create({
        data: {
          title,
          description: description || null,
          date,
          time: time || null,
          imageUrl: imageUrl || null,
          schoolId: schoolProfile.id,
        },
      });

      return NextResponse.json(event);
    }
  } catch (error) {
    console.error('Failed to create school event:', error);
    return NextResponse.json({ error: 'Failed to create school event' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const user = session.user as any;
    const schoolProfile = await prisma.schoolProfile.findUnique({
      where: { userId: user.id },
    });

    const event = await prisma.schoolEvent.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    if (!schoolProfile || event.schoolId !== schoolProfile.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const title = formData.get('title') as string | null;
      const description = formData.get('description') as string | null;
      const date = formData.get('date') as string | null;
      const time = formData.get('time') as string | null;
      const file = formData.get('image') as File | null;
      const removeImage = formData.get('removeImage') === 'true';

      const data: any = { status: 'PENDING', approvedAt: null, reviewedBy: null, rejectionReason: null };
      if (title) data.title = title;
      if (description !== null) data.description = description;
      if (date) data.date = date;
      if (time !== null) data.time = time;

      if (removeImage && event.imageUrl) {
        const oldFilepath = path.join(process.cwd(), 'public', event.imageUrl);
        try { await unlink(oldFilepath); } catch (e) { /* ignore */ }
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
        if (event.imageUrl) {
          const oldFilepath = path.join(process.cwd(), 'public', event.imageUrl);
          try { await unlink(oldFilepath); } catch (e) { /* ignore */ }
        }
        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `school-event-${crypto.randomUUID()}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'school');
        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        data.imageUrl = `/images/school/${filename}`;
      }

      const updated = await prisma.schoolEvent.update({ where: { id }, data });
      return NextResponse.json(updated);
    } else {
      const body = await request.json();
      const { title, description, date, time, imageUrl } = body;

      const data: any = { status: 'PENDING', approvedAt: null, reviewedBy: null, rejectionReason: null };
      if (title !== undefined) data.title = title;
      if (description !== undefined) data.description = description;
      if (date !== undefined) data.date = date;
      if (time !== undefined) data.time = time;
      if (imageUrl !== undefined) data.imageUrl = imageUrl;

      const updated = await prisma.schoolEvent.update({ where: { id }, data });
      return NextResponse.json(updated);
    }
  } catch (error) {
    console.error('Failed to update school event:', error);
    return NextResponse.json({ error: 'Failed to update school event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const user = session.user as any;
    const schoolProfile = await prisma.schoolProfile.findUnique({
      where: { userId: user.id },
    });

    const event = await prisma.schoolEvent.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    if (!schoolProfile || (event.schoolId !== schoolProfile.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (event.imageUrl) {
      const filepath = path.join(process.cwd(), 'public', event.imageUrl);
      try { await unlink(filepath); } catch (e) { /* ignore */ }
    }

    await prisma.schoolEvent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete school event:', error);
    return NextResponse.json({ error: 'Failed to delete school event' }, { status: 500 });
  }
}
