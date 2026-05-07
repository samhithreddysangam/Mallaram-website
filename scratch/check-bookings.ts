import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking Supabase for bookings...');
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        slot: true
      }
    });

    console.log(`Found ${bookings.length} bookings in the current database.`);
    
    if (bookings.length > 0) {
      bookings.forEach(b => {
        console.log(`- Booking ID: ${b.id}`);
        console.log(`  Farmer: ${b.user?.name} (${b.user?.phone})`);
        console.log(`  Status: ${b.status}`);
      });
    }

    const users = await prisma.user.findMany();
    console.log(`Total users in DB: ${users.length}`);

  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
