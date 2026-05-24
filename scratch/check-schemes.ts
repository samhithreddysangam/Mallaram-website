import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSchemes() {
  console.log('Checking database for schemes...');
  try {
    const schemes = await prisma.scheme.findMany();
    console.log('Total schemes found:', schemes.length);
    schemes.forEach((s, i) => {
      console.log(`${i+1}. ${s.title} (${s.link})`);
    });
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchemes();
