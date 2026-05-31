import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function GET() {
  try {
    const members = await prisma.localBodyMember.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error('Failed to fetch local body members:', error);
    return NextResponse.json({ error: 'Failed to fetch local body members' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const name = formData.get('name') as string;
      const designation = formData.get('designation') as string;
      const description = formData.get('description') as string | null;
      const category = formData.get('category') as string || 'ward_member';
      const ward = formData.get('ward') as string | null;
      const order = parseInt(formData.get('order') as string) || 0;
      const active = formData.get('active') !== 'false';
      const file = formData.get('image') as File | null;

      if (!name || !designation) {
        return NextResponse.json({ error: 'Name and designation are required' }, { status: 400 });
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
        const filename = `localbody-${crypto.randomUUID()}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'local-body');
        
        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        imageUrl = `/images/local-body/${filename}`;
      }

      const member = await prisma.localBodyMember.create({
        data: { name, designation, description, imageUrl, category, ward, order, active },
      });

      return NextResponse.json(member);
    } else {
      const body = await request.json();
      const { name, designation, description, imageUrl, category, ward, order, active } = body;

      if (!name || !designation) {
        return NextResponse.json({ error: 'Name and designation are required' }, { status: 400 });
      }

      const member = await prisma.localBodyMember.create({
        data: {
          name,
          designation,
          description: description || null,
          imageUrl: imageUrl || null,
          category: category || 'ward_member',
          ward: ward || null,
          order: order || 0,
          active: active !== false,
        },
      });

      return NextResponse.json(member);
    }
  } catch (error) {
    console.error('Failed to create local body member:', error);
    return NextResponse.json({ error: 'Failed to create local body member' }, { status: 500 });
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
      const designation = formData.get('designation') as string | null;
      const description = formData.get('description') as string | null;
      const category = formData.get('category') as string | null;
      const ward = formData.get('ward') as string | null;
      const order = formData.get('order') ? parseInt(formData.get('order') as string) : undefined;
      const active = formData.get('active') !== undefined ? formData.get('active') !== 'false' : undefined;
      const file = formData.get('image') as File | null;
      const removeImage = formData.get('removeImage') === 'true';

      const data: any = {};
      if (name) data.name = name;
      if (designation) data.designation = designation;
      if (description !== null) data.description = description;
      if (category) data.category = category;
      if (ward !== null) data.ward = ward;
      if (order !== undefined) data.order = order;
      if (active !== undefined) data.active = active;

      if (removeImage) {
        const existing = await prisma.localBodyMember.findUnique({ where: { id } });
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

        const existing = await prisma.localBodyMember.findUnique({ where: { id } });
        if (existing?.imageUrl) {
          const oldFilepath = path.join(process.cwd(), 'public', existing.imageUrl);
          try { await unlink(oldFilepath); } catch (e) { /* ignore */ }
        }

        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `localbody-${crypto.randomUUID()}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'local-body');
        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        data.imageUrl = `/images/local-body/${filename}`;
      }

      const member = await prisma.localBodyMember.update({
        where: { id },
        data,
      });

      return NextResponse.json(member);
    } else {
      const body = await request.json();
      const { name, designation, description, imageUrl, category, ward, order, active } = body;

      const data: any = {};
      if (name) data.name = name;
      if (designation) data.designation = designation;
      if (description !== undefined) data.description = description;
      if (category) data.category = category;
      if (ward !== undefined) data.ward = ward;
      if (imageUrl !== undefined) data.imageUrl = imageUrl;
      if (order !== undefined) data.order = order;
      if (active !== undefined) data.active = active;

      const member = await prisma.localBodyMember.update({
        where: { id },
        data,
      });

      return NextResponse.json(member);
    }
  } catch (error) {
    console.error('Failed to update local body member:', error);
    return NextResponse.json({ error: 'Failed to update local body member' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const member = await prisma.localBodyMember.findUnique({ where: { id } });
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    if (member.imageUrl) {
      const filepath = path.join(process.cwd(), 'public', member.imageUrl);
      try { await unlink(filepath); } catch (e) { /* ignore */ }
    }

    await prisma.localBodyMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete local body member:', error);
    return NextResponse.json({ error: 'Failed to delete local body member' }, { status: 500 });
  }
}
