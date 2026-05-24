import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Ensuring Admin User exists...');
  
  const adminEmail = 'arpitha@mallaram.in';
  const adminPassword = 'mallaram123';

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      password: adminPassword, // Ensuring password is correct
    },
    create: {
      email: adminEmail,
      name: 'Admin Arpitha',
      phone: '9989120933',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user ready:', admin.email);
  console.log('Role:', admin.role);
  console.log('Please log in with:');
  console.log('Email:', adminEmail);
  console.log('Password:', adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
