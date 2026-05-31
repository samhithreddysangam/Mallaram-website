import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const farmers = await prisma.farmerEnrollment.findMany({
      select: {
        id: true,
        crops: true,
        language: true,
        village: true,
        ward: true,
        consentAlerts: true,
        active: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const total = farmers.length;

    // Registration trends (monthly)
    const monthlyTrend: Record<string, number> = {};
    farmers.forEach((f) => {
      const key = f.createdAt.toISOString().slice(0, 7); // "2026-05"
      monthlyTrend[key] = (monthlyTrend[key] || 0) + 1;
    });

    // Crop distribution (crops are comma-separated strings, e.g. "Paddy, Cotton, Maize")
    const cropCounts: Record<string, number> = {};
    farmers.forEach((f) => {
      if (f.crops) {
        f.crops.split(',').forEach((c) => {
          const crop = c.trim().toLowerCase();
          if (crop) {
            cropCounts[crop] = (cropCounts[crop] || 0) + 1;
          }
        });
      }
    });

    // Language preferences
    const languageCounts: Record<string, number> = {};
    farmers.forEach((f) => {
      const lang = f.language || 'te';
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    });

    // Ward distribution
    const wardCounts: Record<string, number> = {};
    farmers.forEach((f) => {
      const ward = f.ward || 'Unassigned';
      wardCounts[ward] = (wardCounts[ward] || 0) + 1;
    });

    // Consent & active stats
    const consentAlerts = farmers.filter((f) => f.consentAlerts).length;
    const activeCount = farmers.filter((f) => f.active).length;

    return NextResponse.json({
      total,
      activeCount,
      inactiveCount: total - activeCount,
      consentAlerts,
      noConsent: total - consentAlerts,
      monthlyTrend: Object.entries(monthlyTrend)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month)),
      cropDistribution: Object.entries(cropCounts)
        .map(([crop, count]) => ({ crop, count }))
        .sort((a, b) => b.count - a.count),
      languagePreferences: Object.entries(languageCounts)
        .map(([lang, count]) => ({ lang, count })),
      wardDistribution: Object.entries(wardCounts)
        .map(([ward, count]) => ({ ward, count }))
        .sort((a, b) => b.count - a.count),
    });
  } catch (error) {
    console.error('Failed to fetch farmer analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch farmer analytics' },
      { status: 500 }
    );
  }
}
