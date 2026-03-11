// import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { PrismaClient } from 'generated/prisma/client.js';

dotenv.config();

async function removeBrokenImages() {
  // Configure Prisma for version 7
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('🔧 Removing broken images...\n');

    // Product with broken image
    const productId = 'cmmlt1tl900096tm0ce17gp3u';
    const brokenImageUrl =
      'https://res.cloudinary.com/dxkaa5m0q/image/upload/v1773219404/ecommerce/products/g7r794775s3hbj4brxmd.jpg';

    // Get the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      console.log('❌ Product not found');
      return;
    }

    console.log(`📦 Product: ${product.name}`);
    console.log(`Current images:`, product.images);

    // Filter out the broken image
    const updatedImages = product.images.filter(
      (url) => url !== brokenImageUrl,
    );

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        images: updatedImages,
      },
    });

    console.log('\n✅ Image removed successfully!');
    console.log(`Updated images:`, updatedProduct.images);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeBrokenImages();
