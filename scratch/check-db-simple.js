import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
  console.log('--- Database Admin Check ---');
  try {
    const admin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'arpitha@mallaram.in' },
          { role: 'ADMIN' }
        ]
      }
    });

    if (admin) {
      console.log('Admin User Found:');
      console.log('ID:', admin.id);
      console.log('Email:', admin.email);
      console.log('Phone:', admin.phone);
      console.log('Role:', admin.role);
      console.log('Password (masked):', admin.password.substring(0, 3) + '...');
    } else {
      console.log('Admin user NOT FOUND in database.');
      const allUsers = await prisma.user.findMany({ select: { email: true, role: true } });
      console.log('Total users in DB:', allUsers.length);
      console.log('Users:', allUsers);
    }
  } catch (error) {
    console.error('Database Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
