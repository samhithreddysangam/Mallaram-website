import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const schemeKeywords = ['yojana', 'scheme', 'pension', 'bima', 'swasthya', 'gram', 'gramin', 'kisan', 'krishi', 'awas', 'shiksha', 'education', 'health', 'agriculture', 'rural', 'urban', 'welfare', 'subsidy', 'nidhi', 'bandhu', 'suraksha', 'jeevan', 'jal', 'sinchayee', 'fasal', 'bhima', 'shakti', 'uyojana'];

async function checkAuth(request: Request): Promise<boolean> {
  const { searchParams } = new URL(request.url);
  const cronSecret = searchParams.get('secret');
  const isAdminTrigger = searchParams.get('admin') === 'true';
  
  if (process.env.CRON_SECRET && cronSecret === process.env.CRON_SECRET) {
    return true;
  }
  
  if (isAdminTrigger) {
    try {
      const session = await auth();
      if (session?.user) {
        const user = session.user as any;
        if (user.role === 'ADMIN') return true;
      }
    } catch { /* ignore */ }
  }
  return false;
}

async function runCheck() {
  const results: {
    scanned: string[];
    newSchemes: number;
    errors: string[];
    timestamp: string;
  } = {
    scanned: [],
    newSchemes: 0,
    errors: [],
    timestamp: new Date().toISOString(),
  };

  const allTitles = new Set(
    (await prisma.scheme.findMany({ select: { title: true } })).map(s => s.title.toLowerCase())
  );

  const isDuplicate = (title: string) => {
    const lower = title.toLowerCase();
    return [...allTitles].some(t => t.includes(lower.substring(0, 30)) || lower.includes(t.substring(0, 30)));
  };

  // --- Source 1: data.gov.in (if configured) ---
  if (process.env.DATA_GOV_IN_API_KEY) {
    try {
      results.scanned.push('data.gov.in');
      // Search for scheme-related datasets with multiple queries for better coverage
      const queries = ['scheme', 'yojana', 'government+welfare', 'rural+development'];
      
      for (const query of queries) {
        const searchRes = await fetch(
          `https://api.data.gov.in/resource-list?api-key=${process.env.DATA_GOV_IN_API_KEY}&format=json&limit=25&q=${query}`,
          { signal: AbortSignal.timeout(8000) }
        );
        
        if (searchRes.ok) {
          const data = await searchRes.json();
          const records = data?.records || [];
          
          for (const record of records) {
            const title = (record.title || record.name || '').trim();
            if (!title || title.length < 5) continue;
            if (isDuplicate(title)) continue;

            // Only create if title contains scheme-related keywords
            const lowerTitle = title.toLowerCase();
            const isRelevant = schemeKeywords.some(kw => lowerTitle.includes(kw));
            if (!isRelevant) continue;

            await prisma.scheme.create({
              data: {
                title: title.substring(0, 200),
                link: record.url || record.download_url || `https://data.gov.in`,
                description: (record.description || record.notes || '').substring(0, 500),
                source: 'CENTRAL',
                status: 'PENDING',
              },
            });
            allTitles.add(title.toLowerCase());
            results.newSchemes++;
          }
        }
      }
    } catch (e: any) {
      results.errors.push(`data.gov.in: ${e.message}`);
    }
  }

  // --- Source 2: myScheme.gov.in ---
  try {
    results.scanned.push('myScheme.gov.in');
    const homeRes = await fetch('https://www.myscheme.gov.in/', {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MallaramBot/1.0)' },
    });
    
    if (homeRes.ok) {
      const html = await homeRes.text();
      
      // Try multiple patterns to find scheme names
      const patterns = [
        /<h([1-6])[^>]*>([^<]+)<\/h\1>/gi,
        /<a[^>]*href="[^"]*scheme[^"]*"[^>]*>([^<]+)<\/a>/gi,
        /<[^>]*class="[^"]*(?:scheme|card|scheme-card)[^"]*"[^>]*>([^<]+)<\//gi,
      ];

      const found = new Set<string>();
      for (const pattern of patterns) {
        const matches = html.matchAll(pattern);
        for (const match of matches) {
          const text = (match[2] || match[1] || '').trim();
          if (!text || text.length < 5 || text.length > 150) continue;
          
          const lower = text.toLowerCase();
          const isRelevant = schemeKeywords.some(kw => lower.includes(kw));
          if (!isRelevant) continue;
          
          const key = lower.substring(0, 40);
          if (found.has(key)) continue;
          found.add(key);
          
          if (isDuplicate(text)) continue;

          await prisma.scheme.create({
            data: {
              title: text.substring(0, 200),
              link: `https://www.myscheme.gov.in/search?q=${encodeURIComponent(text)}`,
              description: `Auto-discovered from myScheme.gov.in`,
              source: 'CENTRAL',
              status: 'PENDING',
            },
          });
          allTitles.add(text.toLowerCase());
          results.newSchemes++;
        }
      }
    }
  } catch (e: any) {
    results.errors.push(`myScheme.gov.in: ${e.message}`);
  }

  return results;
}

export async function GET(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const results = await runCheck();
  return NextResponse.json(results);
}

export async function POST(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const results = await runCheck();
  return NextResponse.json(results);
}
