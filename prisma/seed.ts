import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'arpitha@mallaram.in' },
    update: {
      password: 'mallaram123',
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

  // Create School User for MPPS Mallaram
  const schoolUser = await prisma.user.upsert({
    where: { email: 'mpps@mallaram.in' },
    update: {
      password: 'mpps123',
      role: 'SCHOOL',
    },
    create: {
      email: 'mpps@mallaram.in',
      name: 'MPPS Mallaram',
      phone: '9989120934',
      password: 'mpps123',
      role: 'SCHOOL',
    },
  });

  // Create Principal User for MPPS Mallaram
  const principalUser = await prisma.user.upsert({
    where: { email: 'principal@mallaram.in' },
    update: {
      password: 'principal123',
      role: 'PRINCIPAL',
    },
    create: {
      email: 'principal@mallaram.in',
      name: 'School Principal MPPS Mallaram',
      phone: '9989120935',
      password: 'principal123',
      role: 'PRINCIPAL',
    },
  });

  // Create School Profile
  await prisma.schoolProfile.upsert({
    where: { userId: schoolUser.id },
    update: {
      schoolName: 'MPPS Mallaram',
      address: 'Mallaram Village, Vemulavada Rural Mandal, Rajanna Sircilla District',
      phone: '9989120934',
      email: 'mpps@mallaram.in',
    },
    create: {
      userId: schoolUser.id,
      schoolName: 'MPPS Mallaram',
      address: 'Mallaram Village, Vemulavada Rural Mandal, Rajanna Sircilla District',
      phone: '9989120934',
      email: 'mpps@mallaram.in',
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

  // Create initial schemes with rich metadata
  const initialSchemes = [
    {
      title: 'MGNREGA',
      link: 'https://nrega.dord.gov.in/MGNREGA_new/Nrega_home.aspx',
      description: 'Mahatma Gandhi National Rural Employment Guarantee Act — provides 100 days of guaranteed wage employment to rural households.',
      source: 'CENTRAL',
      category: 'Employment',
      eligibility: 'Any adult member of a rural household willing to do unskilled manual work',
      benefits: '100 days of guaranteed wage employment per household per year',
      status: 'APPROVED',
    },
    {
      title: 'PM Awas Yojana (Gramin)',
      link: 'https://pmayg.nic.in/',
      description: 'Pradhan Mantri Awas Yojana — Housing for All by 2024. Provides pucca houses with basic amenities.',
      source: 'CENTRAL',
      category: 'Housing',
      eligibility: 'Households with no pucca house, belonging to BPL or vulnerable groups',
      benefits: 'Financial assistance of up to ₹1.20 lakh for house construction',
      status: 'APPROVED',
    },
    {
      title: 'PM Kisan Samman Nidhi',
      link: 'https://pmkisan.gov.in/',
      description: 'Income support scheme for small and marginal farmers across India.',
      source: 'CENTRAL',
      category: 'Agriculture',
      eligibility: 'All small and marginal farmers with cultivable land',
      benefits: '₹6,000 per year in three equal installments of ₹2,000 each',
      status: 'APPROVED',
    },
    {
      title: 'Ayushman Bharat (PM-JAY)',
      link: 'https://pmjay.gov.in/',
      description: 'Pradhan Mantri Jan Arogya Yojana — world\'s largest health insurance scheme for poor families.',
      source: 'CENTRAL',
      category: 'Health',
      eligibility: 'Families identified through SECC database (rural and urban poor)',
      benefits: 'Health coverage of ₹5 lakh per family per year for secondary/tertiary care hospitalization',
      status: 'APPROVED',
    },
    {
      title: 'Swachh Bharat Mission (Gramin)',
      link: 'https://swachhbharatmission.ddws.gov.in/',
      description: 'National campaign for cleanliness, hygiene and elimination of open defecation in rural areas.',
      source: 'CENTRAL',
      category: 'Infrastructure',
      eligibility: 'All rural households without individual household toilets',
      benefits: 'Financial assistance for toilet construction + behavior change programs',
      status: 'APPROVED',
    },
    {
      title: 'eGramSwaraj',
      link: 'https://egramswaraj.gov.in/',
      description: 'Work-based accounting and monitoring application for Panchayati Raj Institutions across India.',
      source: 'CENTRAL',
      category: 'Digital Services',
      eligibility: 'For use by Gram Panchayats and village officials',
      benefits: 'Digital accounting, real-time progress tracking, transparency in fund utilization',
      status: 'APPROVED',
    },
    {
      title: 'PM-SVANidhi',
      link: 'https://pmsvanidhi.mohua.gov.in/',
      description: 'Pradhan Mantri Street Vendor\'s AatmaNirbhar Nidhi — working capital loans for street vendors.',
      source: 'CENTRAL',
      category: 'Employment',
      eligibility: 'Street vendors in urban and peri-urban areas with a valid certificate of vending',
      benefits: 'Initial loan of ₹10,000 with 7% interest subsidy, timely repayment bonus',
      status: 'APPROVED',
    },
    {
      title: 'Ration Card / Food Security',
      link: 'https://epds.telangana.gov.in/',
      description: 'Telangana Food Security Act — subsidized food grains through PDS to eligible households.',
      source: 'STATE',
      category: 'Social Welfare',
      eligibility: 'Priority households and Antyodaya Anna Yojana (AAY) families as per SECC data',
      benefits: 'Rice at ₹2/kg, wheat at ₹2/kg, subsidized kerosene and other essential commodities',
      status: 'APPROVED',
    },
    {
      title: 'Rythu Bandhu',
      link: 'https://rythubandhu.telangana.gov.in/',
      description: 'Telangana\'s flagship farmer investment support scheme providing direct financial assistance.',
      source: 'STATE',
      category: 'Agriculture',
      eligibility: 'All farmers in Telangana state with agricultural land',
      benefits: '₹10,000 per acre per year (₹5,000 per season) for investment support',
      status: 'PENDING',
    },
    {
      title: 'Telangana Health Card',
      link: 'https://tsprize.telangana.gov.in/',
      description: 'Telangana State health insurance scheme providing cashless treatment for serious ailments.',
      source: 'STATE',
      category: 'Health',
      eligibility: 'All Telangana residents below poverty line and specific vulnerable groups',
      benefits: 'Health coverage up to ₹5 lakh per family for critical illnesses',
      status: 'PENDING',
    },
    {
      title: 'Indiramma Indlu Telangana',
      link: 'https://indirammaindlu.telangana.gov.in/',
      description: 'Telangana state housing scheme providing financial assistance for house construction to the poor.',
      source: 'STATE',
      category: 'Housing',
      eligibility: 'Homeless poor families in rural and urban areas of Telangana',
      benefits: '₹1.50 lakh to ₹4 lakh assistance for house construction based on category',
      status: 'PENDING',
    },
    {
      title: 'SERP Telangana',
      link: 'https://www.serp.telangana.gov.in/',
      description: 'Society for Elimination of Rural Poverty — empowering rural poor through Self Help Groups.',
      source: 'STATE',
      category: 'Social Welfare',
      eligibility: 'Rural poor, especially women members of Self Help Groups (SHGs)',
      benefits: 'Interest-free loans, skill training, livelihood support, bank linkage',
      status: 'PENDING',
    },
  ];

  // Upsert schemes to avoid foreign key conflicts with beneficiaries
  for (const scheme of initialSchemes) {
    const existing = await prisma.scheme.findFirst({ where: { title: scheme.title } });
    if (existing) {
      await prisma.scheme.update({
        where: { id: existing.id },
        data: scheme,
      });
    } else {
      await prisma.scheme.create({
        data: scheme,
      });
    }
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
      imageUrl: '/images/seethakka.jpg',
      description: 'Working tirelessly for rural development and empowerment of Panchayati Raj institutions across Telangana.',
      order: 2,
      active: true,
    },
    {
      name: 'Shri Aadi Srinivas',
      title: 'Hon\'ble MLA, Vemulawada',
      imageUrl: '/images/aadhi-srinivas.jpg',
      description: 'Serving the constituency with dedication and commitment to public welfare and development.',
      order: 3,
      active: true,
    },
    {
      name: 'Smt Garima Agarwal, IAS',
      title: 'Hon\'ble Collector, Rajanna Sircilla District',
      imageUrl: '/images/garima-agarwal.webp',
      description: 'Leading district administration with a vision for inclusive growth and good governance.',
      order: 4,
      active: true,
    },
    {
      name: 'Sangam Arpitha Reddy',
      title: 'Sarpanch, Mallaram Gram Panchayat',
      imageUrl: '/images/arpitha-reddy.jpg',
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

  // Fund Usage — NOT auto-seeded; admin adds entries manually through the dashboard UI

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

  // Create sample school achievements
  const existingAchievements = await prisma.schoolAchievement.count();
  if (existingAchievements === 0) {
    const schoolProfile = await prisma.schoolProfile.findFirst({
      where: { userId: schoolUser.id },
    });
    if (schoolProfile) {
      await prisma.schoolAchievement.create({
        data: {
          title: '100% Pass Percentage in 5th Class',
          description: 'All students of MPPS Mallaram passed the 5th class final examinations with flying colours. Proud moment for the village!',
          status: 'APPROVED',
          approvedAt: new Date(),
          schoolId: schoolProfile.id,
        },
      });
      await prisma.schoolAchievement.create({
        data: {
          title: 'Inter-School Sports Championship Winners',
          description: 'Our students won 5 gold medals in the Mandal-level inter-school sports championship held at Vemulawada.',
          status: 'APPROVED',
          approvedAt: new Date(),
          schoolId: schoolProfile.id,
        },
      });
      await prisma.schoolAchievement.create({
        data: {
          title: 'Science Exhibition 1st Prize',
          description: 'MPPS Mallaram won 1st prize for the best science project on solar-powered water conservation at the district science exhibition.',
          status: 'APPROVED',
          approvedAt: new Date(),
          schoolId: schoolProfile.id,
        },
      });
      await prisma.schoolAchievement.create({
        data: {
          title: 'Digital Literacy Initiative',
          description: 'Successfully completed digital literacy training for 60 students with basic computer skills and typing proficiency.',
          status: 'PENDING',
          schoolId: schoolProfile.id,
        },
      });
      console.log('Seeded sample school achievements.');
    }
  }

  // Create sample school events
  const existingEvents = await prisma.schoolEvent.count();
  if (existingEvents === 0) {
    const schoolProfile = await prisma.schoolProfile.findFirst({
      where: { userId: schoolUser.id },
    });
    if (schoolProfile) {
      await prisma.schoolEvent.create({
        data: {
          title: 'Annual Day Celebration 2026',
          description: 'Annual day celebration with cultural programs, prize distribution, and parent-teacher meet.',
          date: 'April 15, 2026',
          time: '10:00 AM',
          status: 'APPROVED',
          approvedAt: new Date(),
          schoolId: schoolProfile.id,
        },
      });
      await prisma.schoolEvent.create({
        data: {
          title: 'Parent-Teacher Meeting',
          description: 'Quarterly parent-teacher meeting to discuss student progress and school development.',
          date: 'March 28, 2026',
          time: '11:00 AM',
          status: 'APPROVED',
          approvedAt: new Date(),
          schoolId: schoolProfile.id,
        },
      });
      console.log('Seeded sample school events.');
    }
  }

  console.log('\n✅ All seed data created successfully!');
  console.log(`  - Admin user: arpitha@mallaram.in / mallaram123`);
  console.log(`  - School user: mpps@mallaram.in / mpps123`);
  console.log(`  - Principal user: principal@mallaram.in / principal123`);
  console.log(`  - IKP Slots: 7 days × 4 time slots = 28 slots`);
  console.log(`  - Crop Prices: 4 crops`);
  console.log(`  - Schemes: ${initialSchemes.length} government schemes`);
  console.log(`  - Fund Usage: admin adds entries manually through dashboard`);
  console.log(`  - Gallery Images: ${galleryImages.length} records`);
  console.log(`  - School Profile: MPPS Mallaram`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
