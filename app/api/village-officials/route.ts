import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function GET() {
  try {
    const officials = await prisma.villageOfficial.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(officials);
  } catch (error) {
    console.error('Failed to fetch village officials:', error);
    return NextResponse.json({ error: 'Failed to fetch village officials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle form data with image upload
      const formData = await request.formData();
      const name = formData.get('name') as string;
      const title = formData.get('title') as string;
      const description = formData.get('description') as string | null;
      const order = parseInt(formData.get('order') as string) || 0;
      const active = formData.get('active') !== 'false';
      const file = formData.get('image') as File | null;

      if (!name || !title) {
        return NextResponse.json({ error: 'Name and title are required' }, { status: 400 });
      }

      let imageUrl: string | null = null;

      if (file && file.size > 0) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' }, { status: 400 });
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          return NextResponse.json({ error: 'File too large. Max 10MB' }, { status: 400 });
        }

        // Generate unique filename
        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `official-${crypto.randomUUID()}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'officials');
        
        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        imageUrl = `/images/officials/${filename}`;
      }

      const official = await prisma.villageOfficial.create({
        data: { name, title, description, imageUrl, order, active },
      });

      return NextResponse.json(official);
    } else {
      // Handle JSON body (text-only, no image)
      const body = await request.json();
      const { name, title, description, imageUrl, order, active } = body;

      if (!name || !title) {
        return NextResponse.json({ error: 'Name and title are required' }, { status: 400 });
      }

      const official = await prisma.villageOfficial.create({
        data: {
          name,
          title,
          description: description || null,
          imageUrl: imageUrl || null,
          order: order || 0,
          active: active !== false,
        },
      });

      return NextResponse.json(official);
    }
  } catch (error) {
    console.error('Failed to create village official:', error);
    return NextResponse.json({ error: 'Failed to create village official' }, { status: 500 });
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
      const name = formData.get('name') as string | null;
      const title = formData.get('title') as string | null;
      const description = formData.get('description') as string | null;
      const order = formData.get('order') ? parseInt(formData.get('order') as string) : undefined;
      const active = formData.get('active') !== undefined ? formData.get('active') !== 'false' : undefined;
      const file = formData.get('image') as File | null;
      const removeImage = formData.get('removeImage') === 'true';

      const data: any = {};
      if (name) data.name = name;
      if (title) data.title = title;
      if (description !== null) data.description = description;
      if (order !== undefined) data.order = order;
      if (active !== undefined) data.active = active;

      if (removeImage) {
        // Delete old image file
        const existing = await prisma.villageOfficial.findUnique({ where: { id } });
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
        const existing = await prisma.villageOfficial.findUnique({ where: { id } });
        if (existing?.imageUrl) {
          const oldFilepath = path.join(process.cwd(), 'public', existing.imageUrl);
          try { await unlink(oldFilepath); } catch (e) { /* ignore */ }
        }

        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `official-${crypto.randomUUID()}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'officials');
        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        data.imageUrl = `/images/officials/${filename}`;
      }

      const official = await prisma.villageOfficial.update({
        where: { id },
        data,
      });

      return NextResponse.json(official);
    } else {
      const body = await request.json();
      const { name, title, description, imageUrl, order, active } = body;

      const data: any = {};
      if (name) data.name = name;
      if (title) data.title = title;
      if (description !== undefined) data.description = description;
      if (imageUrl !== undefined) data.imageUrl = imageUrl;
      if (order !== undefined) data.order = order;
      if (active !== undefined) data.active = active;

      const official = await prisma.villageOfficial.update({
        where: { id },
        data,
      });

      return NextResponse.json(official);
    }
  } catch (error) {
    console.error('Failed to update village official:', error);
    return NextResponse.json({ error: 'Failed to update village official' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const official = await prisma.villageOfficial.findUnique({ where: { id } });
    if (!official) {
      return NextResponse.json({ error: 'Official not found' }, { status: 404 });
    }

    // Delete image from disk if it exists
    if (official.imageUrl) {
      const filepath = path.join(process.cwd(), 'public', official.imageUrl);
      try { await unlink(filepath); } catch (e) { /* ignore */ }
    }

    await prisma.villageOfficial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete village official:', error);
    return NextResponse.json({ error: 'Failed to delete village official' }, { status: 500 });
  }
}
