import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'arpitha@mallaram.in' },
    update: {},
    create: {
      email: 'arpitha@mallaram.in',
      name: 'Admin Arpitha',
      phone: '9989120933',
      password: 'mallaram123', // In real app, use hashed password
      role: 'ADMIN',
    },
  });

  // Create some slots for the next 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= 7; i++) {
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + i);

    const timeSlots = [
      { start: '10:00 AM', end: '11:00 AM' },
      { start: '11:00 AM', end: '12:00 PM' },
      { start: '02:00 PM', end: '03:00 PM' },
      { start: '03:00 PM', end: '04:00 PM' },
    ];

    for (const time of timeSlots) {
      await prisma.slot.upsert({
        where: {
          date_startTime_endTime: {
            date: slotDate,
            startTime: time.start,
            endTime: time.end,
          },
        },
        update: {},
        create: {
          date: slotDate,
          startTime: time.start,
          endTime: time.end,
          capacity: 15,
        },
      });
    }
  }

  // Create some sample crop prices
  const crops = [
    { name: 'Paddy (Grade A)', price: 2203 },
    { name: 'Maize', price: 2090 },
    { name: 'Cotton', price: 7020 },
    { name: 'Turmeric', price: 6850 },
  ];

  for (const crop of crops) {
    await prisma.cropPrice.create({
      data: {
        cropName: crop.name,
        price: crop.price,
        district: 'Rajanna Sircilla',
        date: new Date(),
      },
    });
  }

  // Create initial schemes
  const initialSchemes = [
    {
      title: 'MGNREGA',
      link: 'https://nrega.dord.gov.in/MGNREGA_new/Nrega_home.aspx',
      description: 'Mahatma Gandhi National Rural Employment Guarantee Act portal for employment and wage information.'
    },
    {
      title: 'Swachh Bharat Mission',
      link: 'https://swachhbharatmission.ddws.gov.in/',
      description: 'National campaign to clean up the streets, roads and rural areas of India.'
    },
    {
      title: 'eGramSwaraj',
      link: 'https://egramswaraj.gov.in/welcome.do',
      description: 'Simplified work based accounting application for Panchayati Raj Institutions.'
    },
    {
      title: 'Telangana e-Panchayat',
      link: 'https://epanchayat.telangana.gov.in/cs',
      description: 'Digital services and information for Gram Panchayats in Telangana.'
    },
    {
      title: 'Indiramma Indlu',
      link: 'https://indirammaindlu.telangana.gov.in/',
      description: 'Housing scheme for the poor in Telangana state.'
    },
    {
      title: 'SERP Telangana',
      link: 'https://www.serp.telangana.gov.in/',
      description: 'Society for Elimination of Rural Poverty - Empowering rural poor through SHGs.'
    },
    {
      title: 'Telangana Agriculture',
      link: 'https://agri.telangana.gov.in/',
      description: 'Portal for agricultural schemes and farmer support in Telangana.'
    },
    {
      title: 'Society Registration',
      link: 'https://registration.telangana.gov.in/societyRegistration.htm',
      description: 'Online registration portal for societies in Telangana.'
    },
    {
      title: 'TGSWREIS',
      link: 'https://tgswreis.telangana.gov.in/',
      description: 'Telangana Social Welfare Residential Educational Institutions Society.'
    },
    {
      title: 'Food Security Card',
      link: 'https://epds.telangana.gov.in/FoodSecurityAct/',
      description: 'Check status and manage Food Security (Ration) Cards in Telangana.'
    },
    {
      title: 'TG Cess',
      link: 'https://tgcessltd.com/',
      description: 'Telangana Cooperative Electric Supply Society Limited.'
    }
  ];

  for (const scheme of initialSchemes) {
    await prisma.scheme.upsert({
      where: { id: scheme.title.toLowerCase().replace(/\s+/g, '-') }, // Using a slug-like ID for seed upsert
      update: {},
      create: {
        id: scheme.title.toLowerCase().replace(/\s+/g, '-'),
        ...scheme
      },
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
