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
    const schoolProfile = await prisma.schoolProfile.findUnique({
      where: { userId: user.id },
    });

    if (!schoolProfile) {
      return NextResponse.json({ error: 'School profile not found' }, { status: 404 });
    }

    const achievements = await prisma.schoolAchievement.findMany({
      where: { schoolId: schoolProfile.id },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== 'SCHOOL') {
      return NextResponse.json({ error: 'Only school users can submit achievements' }, { status: 403 });
    }

    const schoolProfile = await prisma.schoolProfile.findUnique({
      where: { userId: user.id },
    });

    if (!schoolProfile) {
      return NextResponse.json({ error: 'School profile not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const title = formData.get('title') as string;
      const description = formData.get('description') as string | null;
      const file = formData.get('image') as File | null;

      if (!title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
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
        const filename = `school-achievement-${crypto.randomUUID()}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'school');
        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        imageUrl = `/images/school/${filename}`;
      }

      const achievement = await prisma.schoolAchievement.create({
        data: {
          title,
          description: description || null,
          imageUrl,
          schoolId: schoolProfile.id,
        },
      });

      return NextResponse.json(achievement);
    } else {
      const body = await request.json();
      const { title, description, imageUrl } = body;

      if (!title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }

      const achievement = await prisma.schoolAchievement.create({
        data: {
          title,
          description: description || null,
          imageUrl: imageUrl || null,
          schoolId: schoolProfile.id,
        },
      });

      return NextResponse.json(achievement);
    }
  } catch (error) {
    console.error('Failed to create achievement:', error);
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
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

    const achievement = await prisma.schoolAchievement.findUnique({ where: { id } });
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }
    if (!schoolProfile || achievement.schoolId !== schoolProfile.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const title = formData.get('title') as string | null;
      const description = formData.get('description') as string | null;
      const file = formData.get('image') as File | null;
      const removeImage = formData.get('removeImage') === 'true';

      const data: any = {};
      if (title) data.title = title;
      if (description !== null) data.description = description;
      // Reset to PENDING when updated
      data.status = 'PENDING';
      data.approvedAt = null;
      data.reviewedBy = null;
      data.rejectionReason = null;

      if (removeImage && achievement.imageUrl) {
        const oldFilepath = path.join(process.cwd(), 'public', achievement.imageUrl);
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
        if (achievement.imageUrl) {
          const oldFilepath = path.join(process.cwd(), 'public', achievement.imageUrl);
          try { await unlink(oldFilepath); } catch (e) { /* ignore */ }
        }
        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `school-achievement-${crypto.randomUUID()}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'school');
        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        data.imageUrl = `/images/school/${filename}`;
      }

      const updated = await prisma.schoolAchievement.update({ where: { id }, data });
      return NextResponse.json(updated);
    } else {
      const body = await request.json();
      const { title, description, imageUrl } = body;

      const data: any = { status: 'PENDING', approvedAt: null, reviewedBy: null, rejectionReason: null };
      if (title !== undefined) data.title = title;
      if (description !== undefined) data.description = description;
      if (imageUrl !== undefined) data.imageUrl = imageUrl;

      const updated = await prisma.schoolAchievement.update({ where: { id }, data });
      return NextResponse.json(updated);
    }
  } catch (error) {
    console.error('Failed to update achievement:', error);
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
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

    const achievement = await prisma.schoolAchievement.findUnique({ where: { id } });
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }
    if (!schoolProfile || (achievement.schoolId !== schoolProfile.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (achievement.imageUrl) {
      const filepath = path.join(process.cwd(), 'public', achievement.imageUrl);
      try { await unlink(filepath); } catch (e) { /* ignore */ }
    }

    await prisma.schoolAchievement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete achievement:', error);
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
