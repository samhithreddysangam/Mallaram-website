import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.galleryImage.count();
  if (existing > 0) {
    console.log(`Gallery already has ${existing} images. Skipping seed.`);
    return;
  }

  const images = [
    { url: '/images/gallery/gallery-1.jpg', alt: 'Mallaram Village View 1' },
    { url: '/images/gallery/gallery-2.jpg', alt: 'Mallaram Village View 2' },
    { url: '/images/gallery/gallery-3.jpg', alt: 'Mallaram Village View 3' },
    { url: '/images/gallery/gallery-4.jpg', alt: 'Mallaram Village View 4' },
    { url: '/images/gallery/gallery-5.jpg', alt: 'Mallaram Village View 5' },
    { url: '/images/gallery/gallery-6.jpg', alt: 'Mallaram Village View 6' },
    { url: '/images/gallery/gallery-7.jpg', alt: 'Mallaram Village View 7' },
    { url: '/images/gallery/gallery-8.jpg', alt: 'Mallaram Village View 8' },
    { url: '/images/gallery/gallery-9.jpg', alt: 'Mallaram Village View 9' },
    { url: '/images/gallery/gallery-10.jpg', alt: 'Mallaram Village View 10' },
  ];

  for (const img of images) {
    await prisma.galleryImage.create({ data: img });
  }

  console.log(`Seeded ${images.length} gallery images.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
