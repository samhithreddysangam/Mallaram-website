import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schemeId = searchParams.get('schemeId');
    const village = searchParams.get('village');
    const ward = searchParams.get('ward');
    const year = searchParams.get('year');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};

    if (schemeId) where.schemeId = schemeId;
    if (village) where.village = { contains: village, mode: 'insensitive' };
    if (ward) where.ward = ward;
    if (year) {
      const yearNum = parseInt(year);
      where.benefitDate = {
        gte: new Date(`${yearNum}-01-01`),
        lte: new Date(`${yearNum}-12-31`),
      };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { aadhaarMasked: { contains: search } },
      ];
    }

    const [beneficiaries, total] = await Promise.all([
      prisma.beneficiary.findMany({
        where,
        include: { scheme: true, application: true },
        orderBy: { benefitDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.beneficiary.count({ where }),
    ]);

    return NextResponse.json({
      beneficiaries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Failed to fetch beneficiaries:', error);
    return NextResponse.json({ error: 'Failed to fetch beneficiaries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, aadhaarMasked, schemeId, village, ward, benefitAmount, applicationId } = body;

    if (!name || !schemeId || !benefitAmount) {
      return NextResponse.json({ error: 'Name, scheme, and benefit amount are required' }, { status: 400 });
    }

    const beneficiary = await prisma.beneficiary.create({
      data: {
        name,
        phone,
        aadhaarMasked,
        schemeId,
        village: village || 'Mallaram',
        ward,
        benefitAmount: parseFloat(benefitAmount),
        applicationId: applicationId || undefined,
      },
      include: { scheme: true },
    });

    return NextResponse.json(beneficiary, { status: 201 });
  } catch (error) {
    console.error('Failed to create beneficiary:', error);
    return NextResponse.json({ error: 'Failed to create beneficiary' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, phone, aadhaarMasked, schemeId, village, ward, benefitAmount } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (aadhaarMasked !== undefined) updateData.aadhaarMasked = aadhaarMasked;
    if (schemeId) updateData.schemeId = schemeId;
    if (village) updateData.village = village;
    if (ward !== undefined) updateData.ward = ward;
    if (benefitAmount) updateData.benefitAmount = parseFloat(benefitAmount);

    const beneficiary = await prisma.beneficiary.update({
      where: { id },
      data: updateData,
      include: { scheme: true },
    });

    return NextResponse.json(beneficiary);
  } catch (error) {
    console.error('Failed to update beneficiary:', error);
    return NextResponse.json({ error: 'Failed to update beneficiary' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.beneficiary.delete({ where: { id } });

    return NextResponse.json({ message: 'Beneficiary deleted successfully' });
  } catch (error) {
    console.error('Failed to delete beneficiary:', error);
    return NextResponse.json({ error: 'Failed to delete beneficiary' }, { status: 500 });
  }
}
