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

  // ─── Welfare Applications & Beneficiaries for Praja Progress Tracker ───────────────
  console.log('Seeding welfare applications & beneficiaries...');

  // First ensure we have welfare-type schemes
  const welfareSchemeNames = [
    { title: 'Rythu Bandhu', type: 'welfare', link: 'https://rythubandhu.telangana.gov.in/', description: 'Investment support to farmers - ₹5,000 per acre per season.' },
    { title: 'KCR Kits', type: 'welfare', link: 'https://www.telangana.gov.in/', description: 'Maternal and child health support scheme for pregnant women.' },
    { title: 'Aasara Pensions', type: 'welfare', link: 'https://www.telangana.gov.in/', description: 'Social security pensions for elderly, widows, and disabled persons.' },
    { title: 'Kalyana Lakshmi', type: 'welfare', link: 'https://www.telangana.gov.in/', description: 'Financial assistance for marriage of girls from poor families.' },
    { title: 'Indiramma Housing', type: 'welfare', link: 'https://indirammaindlu.telangana.gov.in/', description: 'Free house sites and financial assistance for houseless poor.' },
  ];

  const welfareSchemes: string[] = [];
  for (const ws of welfareSchemeNames) {
    const existing = await prisma.scheme.findFirst({ where: { title: ws.title } });
    if (existing) {
      welfareSchemes.push(existing.id);
    } else {
      const created = await prisma.scheme.create({ data: ws });
      welfareSchemes.push(created.id);
    }
  }

  // Clear existing applications and beneficiaries
  await prisma.beneficiary.deleteMany({});
  await prisma.welfareApplication.deleteMany({});

  // Generate seed application data
  const villages = ['Mallaram', 'Vemulawada', 'Kodurupaka'];
  const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
  
  interface SeedApplicant {
    name: string;
    phone: string;
    aadhaarLast4: string;
    village: string;
    ward: string;
  }

  const seedApplicants: SeedApplicant[] = [
    { name: 'Sangam Arpitha', phone: '9989120933', aadhaarLast4: '4521', village: 'Mallaram', ward: 'Ward 1' },
    { name: 'Koduru Ramesh', phone: '9876543210', aadhaarLast4: '7834', village: 'Mallaram', ward: 'Ward 2' },
    { name: 'Bandi Laxmi', phone: '8765432109', aadhaarLast4: '1298', village: 'Vemulawada', ward: 'Ward 3' },
    { name: 'Peddapally Naresh', phone: '7654321098', aadhaarLast4: '5632', village: 'Mallaram', ward: 'Ward 1' },
    { name: 'Gunda Swapna', phone: '6543210987', aadhaarLast4: '9076', village: 'Kodurupaka', ward: 'Ward 4' },
    { name: 'Mekaiah Yadav', phone: '5432109876', aadhaarLast4: '3401', village: 'Mallaram', ward: 'Ward 2' },
    { name: 'Vennela Shruthi', phone: '4321098765', aadhaarLast4: '6745', village: 'Vemulawada', ward: 'Ward 5' },
    { name: 'Are Raju', phone: '3210987654', aadhaarLast4: '2189', village: 'Kodurupaka', ward: 'Ward 3' },
    { name: 'Sangam Prakash', phone: '9988776655', aadhaarLast4: '5567', village: 'Mallaram', ward: 'Ward 1' },
    { name: 'Boora Anitha', phone: '8877665544', aadhaarLast4: '8923', village: 'Mallaram', ward: 'Ward 4' },
    { name: 'Pendota Shekar', phone: '7766554433', aadhaarLast4: '1456', village: 'Vemulawada', ward: 'Ward 2' },
    { name: 'Gopanpally Srilatha', phone: '6655443322', aadhaarLast4: '3789', village: 'Kodurupaka', ward: 'Ward 5' },
    { name: 'Kotte Srinu', phone: '5544332211', aadhaarLast4: '9012', village: 'Mallaram', ward: 'Ward 3' },
    { name: 'Meka Chinna', phone: '4433221100', aadhaarLast4: '2345', village: 'Vemulawada', ward: 'Ward 1' },
    { name: 'Anumula Padma', phone: '3322110099', aadhaarLast4: '6789', village: 'Mallaram', ward: 'Ward 2' },
    { name: 'Battula Mahesh', phone: '2211009988', aadhaarLast4: '0123', village: 'Kodurupaka', ward: 'Ward 4' },
    { name: 'Shaik Jabeen', phone: '1199008877', aadhaarLast4: '4567', village: 'Mallaram', ward: 'Ward 5' },
    { name: 'Bandari Lavanya', phone: '9988007766', aadhaarLast4: '8901', village: 'Vemulawada', ward: 'Ward 3' },
    { name: 'Jajula Rajitha', phone: '8877006655', aadhaarLast4: '2345', village: 'Mallaram', ward: 'Ward 1' },
    { name: 'Pallavi Swathi', phone: '7766005544', aadhaarLast4: '6789', village: 'Mallaram', ward: 'Ward 2' },
  ];

  const statuses = ['APPROVED', 'APPROVED', 'APPROVED', 'PENDING', 'REJECTED', 'APPROVED', 'PENDING', 'APPROVED', 'APPROVED', 'REJECTED'];
  const benefitAmounts = [5000, 10000, 2500, 15000, 0, 7500, 0, 3000, 12000, 0];

  // Generate applications spread across the last 12 months
  const now = new Date();
  let totalDistributed = 0;
  let appCount = 0;

  for (let monthOffset = 11; monthOffset >= 0; monthOffset--) {
    const baseDate = new Date(now);
    baseDate.setMonth(baseDate.getMonth() - monthOffset);
    baseDate.setDate(1);

    // Generate 5-8 applications per month
    const appsThisMonth = 5 + Math.floor(Math.random() * 4);

    for (let i = 0; i < appsThisMonth; i++) {
      const applicant = seedApplicants[appCount % seedApplicants.length];
      const schemeId = welfareSchemes[appCount % welfareSchemes.length];
      const status = statuses[appCount % statuses.length];
      const amountRow = Math.floor(appCount / statuses.length);
      const benefitAmount = benefitAmounts[(appCount + amountRow) % benefitAmounts.length];
      
      const appDate = new Date(baseDate);
      appDate.setDate(1 + Math.floor(Math.random() * 25));
      
      const approvalDate = status === 'APPROVED' ? new Date(appDate.getTime() + 3 * 24 * 60 * 60 * 1000) : null;
      const rejectionDate = status === 'REJECTED' ? new Date(appDate.getTime() + 2 * 24 * 60 * 60 * 1000) : null;

      const application = await prisma.welfareApplication.create({
        data: {
          applicantName: applicant.name,
          applicantPhone: applicant.phone,
          applicantAadhaar: applicant.aadhaarLast4,
          schemeId,
          village: applicant.village,
          ward: applicant.ward,
          status,
          benefitAmount: benefitAmount > 0 ? benefitAmount : null,
          applicationDate: appDate,
          approvalDate,
          rejectionDate,
          rejectionReason: status === 'REJECTED' ? 'Incomplete documentation' : null,
        },
      });

      if (status === 'APPROVED' && benefitAmount > 0) {
        await prisma.beneficiary.create({
          data: {
            name: applicant.name,
            phone: applicant.phone,
            aadhaarMasked: applicant.aadhaarLast4,
            schemeId,
            village: applicant.village,
            ward: applicant.ward,
            benefitAmount,
            benefitDate: approvalDate || appDate,
            applicationId: application.id,
          },
        });
        totalDistributed += benefitAmount;
      }

      appCount++;
    }
  }

  console.log('\n✅ All seed data created successfully!');
  console.log(`  - Admin user: arpitha@mallaram.in`);
  console.log(`  - IKP Slots: 7 days × 4 time slots = 28 slots`);
  console.log(`  - Crop Prices: 4 crops`);
  console.log(`  - Schemes: ${initialSchemes.length} government schemes + ${welfareSchemeNames.length} welfare schemes`);
  console.log(`  - Fund Usage: ${fundRecords.length} financial records`);
  console.log(`  - Gallery Images: ${galleryImages.length} records`);
  console.log(`  - Welfare Applications: ${appCount} records (12 months history)`);
  console.log(`  - Beneficiaries: multiple records`);
  console.log(`  - Total Welfare Amount Distributed: ₹${totalDistributed.toLocaleString('en-IN')}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
