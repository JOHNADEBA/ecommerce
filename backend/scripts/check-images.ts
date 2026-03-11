// import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { PrismaClient } from 'generated/prisma/client.js';

// Load environment variables
dotenv.config();

// Configure Prisma for version 7
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function checkBrokenImages() {
  console.log('🔍 Checking for broken images...\n');

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  });

  let totalBrokenImages = 0;
  const brokenProducts: Array<{
    id: string;
    name: string;
    brokenImages: string[];
  }> = [];

  for (const product of products) {
    if (product.images && product.images.length > 0) {
      const brokenImages: string[] = [];

      for (const imageUrl of product.images) {
        const exists = await checkImageExists(imageUrl);
        if (!exists) {
          brokenImages.push(imageUrl);
          totalBrokenImages++;
          console.log(`❌ Broken image: ${imageUrl}`);
          console.log(`   Product: ${product.name} (${product.id})\n`);
        }
      }

      if (brokenImages.length > 0) {
        brokenProducts.push({
          id: product.id,
          name: product.name,
          brokenImages,
        });
      }
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Total products checked: ${products.length}`);
  console.log(`   Products with broken images: ${brokenProducts.length}`);
  console.log(`   Total broken images: ${totalBrokenImages}`);

  return brokenProducts;
}

// Run the check
checkBrokenImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
