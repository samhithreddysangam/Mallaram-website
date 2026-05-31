import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, village, ward, landArea, crops, soilType, language, consentAlerts } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required' },
        { status: 400 }
      );
    }

    // Validate phone (10 digits)
    const phoneClean = phone.replace(/\D/g, '');
    if (phoneClean.length !== 10) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit phone number' },
        { status: 400 }
      );
    }

    // Check if phone already enrolled
    const existing = await prisma.farmerEnrollment.findUnique({
      where: { phone: phoneClean },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This phone number is already enrolled. Use a different number or contact the panchayat office.' },
        { status: 409 }
      );
    }

    // Create enrollment
    const farmer = await prisma.farmerEnrollment.create({
      data: {
        name,
        phone: phoneClean,
        village: village || 'Mallaram',
        ward: ward || null,
        landArea: landArea || null,
        crops: crops || null,
        soilType: soilType || null,
        language: language || 'te',
        consentAlerts: consentAlerts !== false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Enrolled successfully! You will now receive weather alerts.',
      farmer: {
        id: farmer.id,
        name: farmer.name,
        phone: farmer.phone,
      },
    });
  } catch (error) {
    console.error('Failed to enroll farmer:', error);
    return NextResponse.json(
      { error: 'Failed to enroll. Please try again later.' },
      { status: 500 }
    );
  }
}
