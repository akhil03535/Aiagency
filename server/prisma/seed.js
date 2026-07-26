/**
 * Seeds the database with initial categories and business templates.
 * Run with: npm run prisma:seed
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { name: 'Social Media', slug: 'social-media', icon: 'share-2', order: 1 },
  { name: 'SEO', slug: 'seo', icon: 'search', order: 2 },
  { name: 'Content Writing', slug: 'content-writing', icon: 'file-text', order: 3 },
  { name: 'Email & SMS', slug: 'email-sms', icon: 'mail', order: 4 },
  { name: 'Video & Audio', slug: 'video-audio', icon: 'video', order: 5 },
  { name: 'Branding', slug: 'branding', icon: 'sparkles', order: 6 },
];

const businessTypes = [
  'Restaurant',
  'Gym',
  'Hospital',
  'Clinic',
  'Salon',
  'Real Estate',
  'Coaching Center',
  'Jewelry Shop',
  'Travel Agency',
  'Cafe',
  'Bakery',
  'School',
  'College',
  'Temple',
  'Astrologer',
  'Freelancer',
  'Startup',
  'Software Company',
  'Ecommerce Store',
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('Seeding categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const socialCategory = await prisma.category.findUnique({
    where: { slug: 'social-media' },
  });

  console.log('Seeding business templates...');
  for (const businessType of businessTypes) {
    const slug = slugify(businessType);
    await prisma.template.upsert({
      where: { slug },
      update: { businessType },
      create: {
        name: `${businessType} Starter Pack`,
        slug,
        businessType,
        description: `Prebuilt prompt defaults tuned for ${businessType.toLowerCase()} businesses.`,
        categoryId: socialCategory?.id,
        promptHints: {
          tone: 'PROFESSIONAL',
          suggestedAudience: `Local customers interested in ${businessType.toLowerCase()} services`,
        },
      },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
