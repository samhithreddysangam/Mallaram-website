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
