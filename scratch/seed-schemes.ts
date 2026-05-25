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
