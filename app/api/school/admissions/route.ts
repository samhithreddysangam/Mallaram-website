import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

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

    const admissions = await prisma.schoolAdmission.findMany({
      where: { schoolId: schoolProfile.id },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json({ admissions, total: admissions.length });
  } catch (error) {
    console.error('Failed to fetch admissions:', error);
    return NextResponse.json({ error: 'Failed to fetch admissions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, classApplying, parentName, phone, address, previousSchool } = body;

    if (!studentName || !classApplying || !parentName || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find MPPS Mallaram school profile (this is a public submission endpoint)
    const schoolProfile = await prisma.schoolProfile.findFirst({
      where: { schoolName: { contains: 'MPPS Mallaram' } },
    });

    if (!schoolProfile) {
      return NextResponse.json({ error: 'School not found. Please contact admin.' }, { status: 404 });
    }

    const admission = await prisma.schoolAdmission.create({
      data: {
        studentName,
        classApplying,
        parentName,
        phone,
        address: address || null,
        previousSchool: previousSchool || null,
        schoolId: schoolProfile.id,
      },
    });

    return NextResponse.json(admission);
  } catch (error) {
    console.error('Failed to create admission:', error);
    return NextResponse.json({ error: 'Failed to create admission' }, { status: 500 });
  }
}
