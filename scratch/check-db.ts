import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
  console.log('Checking database for admin user...');
  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'arpitha@mallaram.in' },
    });

    if (admin) {
      console.log('Admin user found!');
      console.log('Name:', admin.name);
      console.log('Role:', admin.role);
      console.log('Password Length:', admin.password.length);
      console.log('Password Matches Seed:', admin.password === 'manamallaram@admin015');
    } else {
      console.log('Admin user NOT FOUND in database.');
    }
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
