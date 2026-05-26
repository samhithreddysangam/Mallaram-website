import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'arpitha@mallaram.in' },
    update: {
      password: 'mallaram123', // Update password if user exists
      role: 'ADMIN',
    },
    create: {
      email: 'arpitha@mallaram.in',
      name: 'Admin Arpitha',
      phone: '9989120933',
      password: 'mallaram123',
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
      title: 'e-Panchayat Telangana',
      link: 'https://epanchayat.telangana.gov.in/cs',
      description: 'Digital services and information for Gram Panchayats in Telangana.'
    },
    {
      title: 'Indiramma Indlu Telangana',
      link: 'https://indirammaindlu.telangana.gov.in/',
      description: 'Housing scheme for the poor in Telangana state.'
    },
    {
      title: 'SERP Telangana',
      link: 'https://www.serp.telangana.gov.in/',
      description: 'Society for Elimination of Rural Poverty - Empowering rural poor through SHGs.'
    },
    {
      title: 'Agriculture Telangana',
      link: 'https://agri.telangana.gov.in/',
      description: 'Portal for agricultural schemes and farmer support in Telangana.'
    },
    {
      title: 'Society Registration Telangana',
      link: 'https://registration.telangana.gov.in/societyRegistration.htm',
      description: 'Online registration portal for societies in Telangana.'
    },
    {
      title: 'TGSWREIS',
      link: 'https://tgswreis.telangana.gov.in/',
      description: 'Telangana Social Welfare Residential Educational Institutions Society.'
    },
    {
      title: 'EPDS Food Security',
      link: 'https://epds.telangana.gov.in/FoodSecurityAct/?wicket:bookmarkablePage=:nic.fsc.foodsecurity.FscSearch',
      description: 'Check status and manage Food Security (Ration) Cards in Telangana.'
    },
    {
      title: 'TGCESS',
      link: 'https://tgcessltd.com/',
      description: 'Telangana Cooperative Electric Supply Society Limited.'
    }
  ];

  // Clear existing schemes to avoid duplicates with old labels
  await prisma.scheme.deleteMany({});

  for (const scheme of initialSchemes) {
    await prisma.scheme.create({
      data: scheme,
    });
  }

  // Create village officials
  console.log('Seeding village officials...');
  const officials = [
    {
      name: 'Shri A. Revanth Reddy',
      title: 'Hon\'ble Chief Minister, Telangana',
      imageUrl: '/images/revanth-reddy.jpg',
      description: 'Under the leadership of Revanth Reddy, our village has taken a crucial step towards transparent and accountable governance through Digital Telangana.',
      order: 1,
      active: true,
    },
    {
      name: 'Smt D. Anasuya Seethakka (Dansari Anasuya)',
      title: 'Minister of PR & RD',
      description: 'Working tirelessly for rural development and empowerment of Panchayati Raj institutions across Telangana.',
      order: 2,
      active: true,
    },
    {
      name: 'Shri Aadi Srinivas',
      title: 'Hon\'ble MLA, Vemulawada',
      description: 'Serving the constituency with dedication and commitment to public welfare and development.',
      order: 3,
      active: true,
    },
    {
      name: 'Smt Garima Agarwal, IAS',
      title: 'Hon\'ble Collector, Rajanna Sircilla District',
      description: 'Leading district administration with a vision for inclusive growth and good governance.',
      order: 4,
      active: true,
    },
    {
      name: 'Sangam Arpitha Reddy',
      title: 'Sarpanch, Mallaram Gram Panchayat',
      description: 'Leading the village towards digital transformation and sustainable development with community participation.',
      order: 5,
      active: true,
    },
  ];

  // Clear existing officials to ensure correct order on re-seed
  await prisma.villageOfficial.deleteMany({});

  for (const official of officials) {
    await prisma.villageOfficial.create({ data: official });
  }
  console.log(`Seeded ${officials.length} village official(s).`);

  // Create sample fund usage records
  console.log('Seeding fund usage records...');
  const fundRecords = [
    { label: 'CC Road Construction Ward 3', amount: 1250000, category: 'Infrastructure', description: 'Construction of cement concrete road in Ward 3 covering 500 meters with drainage.', date: new Date('2025-12-15') },
    { label: 'School Toilet Renovation', amount: 350000, category: 'Education', description: 'Renovation of 4 toilet blocks at ZP High School including new tiles and plumbing.', date: new Date('2026-01-10') },
    { label: 'Handpump Installation', amount: 85000, category: 'Water', description: 'Installation of 2 new handpumps in SC Colony for clean drinking water access.', date: new Date('2026-02-05') },
    { label: 'Street Light Maintenance', amount: 120000, category: 'Electricity', description: 'Replacement of 25 LED street lights and 5 new pole installations in main road.', date: new Date('2026-02-20') },
    { label: 'Village Library Setup', amount: 250000, category: 'Education', description: 'Setup of digital library with 10 computers, books, and furniture at community hall.', date: new Date('2026-03-01') },
    { label: 'Drainage Cleaning - Pre Monsoon', amount: 75000, category: 'Sanitation', description: 'Pre-monsoon cleaning and desilting of all major drainage channels in the village.', date: new Date('2026-03-15') },
    { label: 'Health Camp - Eye Checkup', amount: 45000, category: 'Healthcare', description: 'Free eye checkup camp organized in collaboration with district hospital. 200+ patients screened.', date: new Date('2026-04-01') },
    { label: 'Community Borewell', amount: 180000, category: 'Water', description: 'Deep borewell drilling at community center for irrigation of village garden.', date: new Date('2026-04-10') },
    { label: 'Flood Relief Distribution', amount: 95000, category: 'Emergency', description: 'Distribution of food kits and tarpaulins to 45 families affected by heavy rains.', date: new Date('2026-05-20') },
    { label: 'Anganwadi Center Upgrades', amount: 165000, category: 'Infrastructure', description: 'Repair and upgrade of Anganwadi center with new furniture, toys, and cooking equipment.', date: new Date('2026-06-01') },
  ];

  // Clear existing records to avoid duplicates on re-run
  await prisma.fundUsage.deleteMany({});

  for (const record of fundRecords) {
    await prisma.fundUsage.create({ data: record });
  }

  // Create gallery image records (placeholder paths — actual images should be uploaded via admin)
  console.log('Seeding gallery image records...');
  const galleryImages = [
    { url: '/images/gallery/gallery-1.jpg', alt: 'Mallaram Village Panorama', description: 'A panoramic view of Mallaram village showing the lush green fields and traditional houses.' },
    { url: '/images/gallery/gallery-2.jpg', alt: 'Temple Festival Celebration', description: 'Annual Bonalu festival celebration at the village temple with traditional music and dance.' },
    { url: '/images/gallery/gallery-3.jpg', alt: 'Paddy Harvest Season', description: 'Farmers harvesting paddy in the fields during the Kharif season.' },
    { url: '/images/gallery/gallery-4.jpg', alt: 'Village Pond Renovation', description: 'The recently renovated village pond serving as a water reservoir for irrigation.' },
    { url: '/images/gallery/gallery-5.jpg', alt: 'School Children', description: 'Children at the ZP High School during the morning assembly.' },
    { url: '/images/gallery/gallery-6.jpg', alt: 'Gram Panchayat Meeting', description: 'Monthly Gram Panchayat meeting discussing village development plans.' },
    { url: '/images/gallery/gallery-7.jpg', alt: 'Women Self Help Group', description: 'Women SHG members working on traditional handicrafts and papad making.' },
    { url: '/images/gallery/gallery-8.jpg', alt: 'Village Sports Day', description: 'Annual sports day event with cricket tournament and traditional games for children.' },
  ];

  const existingGalleryCount = await prisma.galleryImage.count();
  if (existingGalleryCount === 0) {
    for (const img of galleryImages) {
      await prisma.galleryImage.create({ data: img });
    }
    console.log(`Seeded ${galleryImages.length} gallery image records.`);
  } else {
    console.log(`Gallery already has ${existingGalleryCount} records. Skipping gallery seed.`);
  }

  console.log('\n✅ All seed data created successfully!');
  console.log(`  - Admin user: arpitha@mallaram.in`);
  console.log(`  - IKP Slots: 7 days × 4 time slots = 28 slots`);
  console.log(`  - Crop Prices: 4 crops`);
  console.log(`  - Schemes: ${initialSchemes.length} government schemes`);
  console.log(`  - Fund Usage: ${fundRecords.length} financial records`);
  console.log(`  - Gallery Images: ${galleryImages.length} records`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
