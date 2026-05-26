import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { aadhaarLast4, applicationId } = body;

    if (!aadhaarLast4 && !applicationId) {
      return NextResponse.json(
        { error: 'Please provide Aadhaar last 4 digits or Application ID' },
        { status: 400 }
      );
    }

    let application;

    if (applicationId) {
      application = await prisma.welfareApplication.findUnique({
        where: { id: applicationId },
        include: { scheme: { select: { title: true } }, beneficiary: { select: { benefitAmount: true, benefitDate: true } } },
      });

      if (!application) {
        return NextResponse.json(
          { error: 'No application found with this ID' },
          { status: 404 }
        );
      }
    } else if (aadhaarLast4) {
      if (aadhaarLast4.length !== 4 || !/^\d{4}$/.test(aadhaarLast4)) {
        return NextResponse.json(
          { error: 'Please enter exactly 4 digits of Aadhaar number' },
          { status: 400 }
        );
      }

      const applications = await prisma.welfareApplication.findMany({
        where: { applicantAadhaar: aadhaarLast4 },
        include: { scheme: { select: { title: true } }, beneficiary: { select: { benefitAmount: true, benefitDate: true } } },
        orderBy: { applicationDate: 'desc' },
        take: 10,
      });

      if (applications.length === 0) {
        return NextResponse.json(
          { error: 'No applications found for this Aadhaar' },
          { status: 404 }
        );
      }

      // Return minimal public-safe data
      const safeResults = applications.map(app => ({
        applicationId: app.id,
        applicantName: app.applicantName.charAt(0) + '***', // Partial name for privacy
        schemeName: app.scheme.title,
        status: app.status,
        applicationDate: app.applicationDate,
        benefitAmount: app.beneficiary?.benefitAmount || app.benefitAmount,
        benefitDate: app.beneficiary?.benefitDate || null,
      }));

      return NextResponse.json({ applications: safeResults, multiple: true });
    }

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({
      application: {
        applicationId: application.id,
        applicantName: application.applicantName.charAt(0) + '***',
        schemeName: application.scheme.title,
        status: application.status,
        applicationDate: application.applicationDate,
        benefitAmount: application.beneficiary?.benefitAmount || application.benefitAmount,
        benefitDate: application.beneficiary?.benefitDate || null,
        approvalDate: application.approvalDate,
        rejectionReason: application.rejectionReason,
      },
      multiple: false,
    });
  } catch (error) {
    console.error('Verification failed:', error);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
