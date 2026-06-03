import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

/**
 * GET /api/cron/check-schemes
 * 
 * Can be called:
 * 1. By a cron service (e.g., cron-job.org) daily
 * 2. Manually by admin via the "Scan Government Portals" button
 * 3. With ?admin=true to check auth (manual trigger from admin panel)
 * 4. Without auth check for cron jobs (set CRON_SECRET env var)
 */
export async function GET(request: Request) {
  // Allow either admin auth OR cron secret
  const { searchParams } = new URL(request.url);
  const cronSecret = searchParams.get('secret');
  const isAdminTrigger = searchParams.get('admin') === 'true';
  
  let authorized = false;
  
  // Check cron secret
  if (process.env.CRON_SECRET && cronSecret === process.env.CRON_SECRET) {
    authorized = true;
  }
  
  // Check admin auth (for manual trigger)
  if (isAdminTrigger && !authorized) {
    try {
      const session = await auth();
      if (session?.user) {
        const user = session.user as any;
        if (user.role === 'ADMIN') {
          authorized = true;
        }
      }
    } catch { /* ignore auth errors for cron */ }
  }

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = {
    scanned: [] as string[],
    newSchemes: 0,
    errors: [] as string[],
    timestamp: new Date().toISOString(),
  };

  // --- Source 1: data.gov.in API (if configured) ---
  const dataGovApiKey = process.env.DATA_GOV_IN_API_KEY;
  if (dataGovApiKey) {
    try {
      results.scanned.push('data.gov.in');
      // Search for scheme-related datasets
      const searchRes = await fetch(
        `https://api.data.gov.in/resource-list?api-key=${dataGovApiKey}&format=json&limit=50&q=scheme`,
        { signal: AbortSignal.timeout(10000) }
      );
      
      if (searchRes.ok) {
        const data = await searchRes.json();
        const records = data?.records || [];
        
        for (const record of records) {
          const title = record.title || record.name || '';
          if (!title) continue;

          // Skip if already exists
          const existing = await prisma.scheme.findFirst({
            where: { title: { contains: title.substring(0, 50) } },
          });
          if (existing) continue;

          // Create as PENDING
          const description = record.description || record.notes || '';
          const link = record.url || record.download_url || `https://data.gov.in`;
          
          await prisma.scheme.create({
            data: {
              title: title.substring(0, 200),
              link: link,
              description: description.substring(0, 500),
              source: 'CENTRAL',
              status: 'PENDING',
            },
          });
          results.newSchemes++;
        }
      }
    } catch (e: any) {
      results.errors.push(`data.gov.in: ${e.message}`);
    }
  }

  // --- Source 2: myScheme.gov.in homepage scrape ---
  try {
    results.scanned.push('myScheme.gov.in');
    const homeRes = await fetch('https://www.myscheme.gov.in/', {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'Mallaram-Scheme-Checker/1.0' },
    });
    
    if (homeRes.ok) {
      const html = await homeRes.text();
      
      // Look for scheme names in the HTML
      // myScheme shows schemes as links/cards with scheme names
      const schemeMatches = html.matchAll(
        /<[^>]+class="[^"]*scheme-card[^"]*"[^>]*>[\s\S]*?<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi
      );
      
      for (const match of schemeMatches) {
        const title = match[1]?.trim();
        if (!title || title.length < 5) continue;

        // Skip if already exists
        const existing = await prisma.scheme.findFirst({
          where: { title: { contains: title.substring(0, 30) } },
        });
        if (existing) continue;

        await prisma.scheme.create({
          data: {
            title: title.substring(0, 200),
            link: `https://www.myscheme.gov.in/search?q=${encodeURIComponent(title)}`,
            description: `Automatically discovered from myScheme.gov.in`,
            source: 'CENTRAL',
            status: 'PENDING',
          },
        });
        results.newSchemes++;
      }
    }
  } catch (e: any) {
    results.errors.push(`myScheme.gov.in: ${e.message}`);
  }

  return NextResponse.json(results);
}
