import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalApplications,
      approvedApplications,
      rejectedApplications,
      pendingApplications,
      totalBeneficiaries,
      beneficiaryAmountResult,
    ] = await Promise.all([
      prisma.welfareApplication.count(),
      prisma.welfareApplication.count({ where: { status: 'APPROVED' } }),
      prisma.welfareApplication.count({ where: { status: 'REJECTED' } }),
      prisma.welfareApplication.count({ where: { status: 'PENDING' } }),
      prisma.beneficiary.count(),
      prisma.beneficiary.aggregate({ _sum: { benefitAmount: true } }),
    ]);

    return NextResponse.json({
      totalApplications,
      approvedApplications,
      rejectedApplications,
      pendingApplications,
      totalBeneficiaries,
      welfareAmountDistributed: beneficiaryAmountResult._sum.benefitAmount || 0,
    });
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
