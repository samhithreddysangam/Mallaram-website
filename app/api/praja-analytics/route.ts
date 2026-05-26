import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterScheme = searchParams.get('schemeId');
    const filterYear = searchParams.get('year');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Build date filters
    let yearFilter = filterYear ? {
      gte: new Date(`${filterYear}-01-01`),
      lte: new Date(`${filterYear}-12-31`),
    } : undefined;

    // Date range overrides year filter if both are provided
    if (dateFrom || dateTo) {
      yearFilter = {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo + 'T23:59:59.999Z') } : {}),
      };
      if (Object.keys(yearFilter).length === 0) yearFilter = undefined;
    }

    // 1. Scheme-wise beneficiary distribution
    const schemeWiseAgg = await prisma.beneficiary.groupBy({
      by: ['schemeId'],
      _count: { id: true },
      _sum: { benefitAmount: true },
      where: yearFilter ? { benefitDate: yearFilter } : {},
    });

    const schemes = await prisma.scheme.findMany({
      where: { type: 'welfare' },
      select: { id: true, title: true },
    });

    const schemeMap = new Map(schemes.map(s => [s.id, s.title]));
    const schemeWiseDistribution = schemeWiseAgg.map(item => ({
      name: schemeMap.get(item.schemeId) || 'Unknown Scheme',
      beneficiaries: item._count.id,
      amount: item._sum.benefitAmount || 0,
    }));

    // 2. Month-wise application growth
    const monthWiseRaw = await prisma.welfareApplication.findMany({
      where: yearFilter ? { applicationDate: yearFilter } : {},
      select: { applicationDate: true, status: true },
    });

    type MonthData = { month: string; applications: number; approved: number; rejected: number; pending: number };
    const monthMap = new Map<string, MonthData>();

    monthWiseRaw.forEach(app => {
      const date = new Date(app.applicationDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { month: monthKey, applications: 0, approved: 0, rejected: 0, pending: 0 });
      }
      const entry = monthMap.get(monthKey)!;
      entry.applications++;
      if (app.status === 'APPROVED') entry.approved++;
      else if (app.status === 'REJECTED') entry.rejected++;
      else entry.pending++;
    });

    const monthWiseGrowth = Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));

    // 3. Approved vs Pending ratio
    const statusCounts = await prisma.welfareApplication.groupBy({
      by: ['status'],
      _count: { id: true },
      where: yearFilter ? { applicationDate: yearFilter } : {},
    });

    const statusMap = new Map(statusCounts.map(s => [s.status, s._count.id]));
    const approvedVsPending = {
      approved: statusMap.get('APPROVED') || 0,
      pending: statusMap.get('PENDING') || 0,
      rejected: statusMap.get('REJECTED') || 0,
    };

    // 4. Village-wise benefit distribution
    const villageWiseRaw = await prisma.beneficiary.groupBy({
      by: ['village'],
      _count: { id: true },
      _sum: { benefitAmount: true },
      where: yearFilter ? { benefitDate: yearFilter } : {},
    });

    const villageWiseDistribution = villageWiseRaw
      .filter(v => v.village)
      .map(item => ({
        name: item.village,
        beneficiaries: item._count.id,
        amount: item._sum.benefitAmount || 0,
      }));

    // 5. Total welfare amount trends (monthly)
    const monthlyAmounts = await prisma.beneficiary.findMany({
      where: yearFilter ? { benefitDate: yearFilter } : {},
      select: { benefitDate: true, benefitAmount: true },
    });

    type AmountMonth = { month: string; amount: number };
    const amountMonthMap = new Map<string, number>();
    monthlyAmounts.forEach(item => {
      const date = new Date(item.benefitDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      amountMonthMap.set(monthKey, (amountMonthMap.get(monthKey) || 0) + item.benefitAmount);
    });

    const welfareAmountTrends = Array.from(amountMonthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }));

    return NextResponse.json({
      schemeWiseDistribution,
      monthWiseGrowth,
      approvedVsPending,
      villageWiseDistribution,
      welfareAmountTrends,
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
