import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialSchemes = [
  {
    title: 'MGNREGA',
    link: 'https://nrega.dord.gov.in/MGNREGA_new/Nrega_home.aspx',
    description: 'Mahatma Gandhi National Rural Employment Guarantee Act portal for employment and wage information.'
  },
  {
    title: 'Swachh Bharat Mission',
    link: 'https://swachhbharatmission.ddws.gov.in/',
    description: 'National campaign to clean up the streets, roads and infrastructure of India\'s cities, towns, and rural areas.'
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
    description: 'Portal for agricultural schemes, subsidies, and farmer support in Telangana.'
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

async function main() {
  console.log('Seeding initial schemes...');
  
  for (const scheme of initialSchemes) {
    await prisma.scheme.create({
      data: scheme,
    });
  }
  
  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
