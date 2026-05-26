import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schemeId = searchParams.get('schemeId');
    const status = searchParams.get('status');
    const village = searchParams.get('village');
    const ward = searchParams.get('ward');
    const year = searchParams.get('year');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};

    if (schemeId) where.schemeId = schemeId;
    if (status) where.status = status;
    if (village) where.village = { contains: village, mode: 'insensitive' };
    if (ward) where.ward = ward;
    if (year) {
      const yearNum = parseInt(year);
      where.applicationDate = {
        gte: new Date(`${yearNum}-01-01`),
        lte: new Date(`${yearNum}-12-31`),
      };
    }
    if (search) {
      where.OR = [
        { applicantName: { contains: search, mode: 'insensitive' } },
        { applicantPhone: { contains: search } },
        { applicantAadhaar: { contains: search } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.welfareApplication.findMany({
        where,
        include: { scheme: true, beneficiary: true },
        orderBy: { applicationDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.welfareApplication.count({ where }),
    ]);

    return NextResponse.json({
      applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { applicantName, applicantPhone, applicantAadhaar, schemeId, village, ward, status, benefitAmount } = body;

    if (!applicantName || !schemeId) {
      return NextResponse.json({ error: 'Name and scheme are required' }, { status: 400 });
    }

    // Mask Aadhaar - only store last 4 digits
    let maskedAadhaar = applicantAadhaar;
    if (maskedAadhaar && maskedAadhaar.length > 4) {
      maskedAadhaar = maskedAadhaar.slice(-4);
    }

    const application = await prisma.welfareApplication.create({
      data: {
        applicantName,
        applicantPhone,
        applicantAadhaar: maskedAadhaar,
        schemeId,
        village: village || 'Mallaram',
        ward,
        status: status || 'PENDING',
        benefitAmount: benefitAmount ? parseFloat(benefitAmount) : null,
        approvalDate: status === 'APPROVED' ? new Date() : null,
      },
    });

    // If approved, also create a beneficiary record
    if (status === 'APPROVED' && benefitAmount) {
      await prisma.beneficiary.create({
        data: {
          name: applicantName,
          phone: applicantPhone,
          aadhaarMasked: maskedAadhaar,
          schemeId,
          village: village || 'Mallaram',
          ward,
          benefitAmount: parseFloat(benefitAmount),
          applicationId: application.id,
        },
      });
    }

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Failed to create application:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, benefitAmount, rejectionReason } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: any = { status };
    if (status === 'APPROVED') {
      updateData.approvalDate = new Date();
      if (benefitAmount) updateData.benefitAmount = parseFloat(benefitAmount);
    }
    if (status === 'REJECTED') {
      updateData.rejectionDate = new Date();
      if (rejectionReason) updateData.rejectionReason = rejectionReason;
    }

    const application = await prisma.welfareApplication.update({
      where: { id },
      data: updateData,
    });

    // If approved with benefit amount, create/update beneficiary
    if (status === 'APPROVED' && (benefitAmount || application.benefitAmount)) {
      const amount = benefitAmount ? parseFloat(benefitAmount) : application.benefitAmount;
      const existingBeneficiary = await prisma.beneficiary.findUnique({
        where: { applicationId: id },
      });

      if (existingBeneficiary) {
        await prisma.beneficiary.update({
          where: { id: existingBeneficiary.id },
          data: { benefitAmount: amount },
        });
      } else {
        await prisma.beneficiary.create({
          data: {
            name: application.applicantName,
            phone: application.applicantPhone,
            aadhaarMasked: application.applicantAadhaar,
            schemeId: application.schemeId,
            village: application.village,
            ward: application.ward,
            benefitAmount: amount,
            applicationId: id,
          },
        });
      }
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Failed to update application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Also delete associated beneficiary
    await prisma.beneficiary.deleteMany({ where: { applicationId: id } });
    await prisma.welfareApplication.delete({ where: { id } });

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Failed to delete application:', error);
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
}
