import { getProduct, getProducts } from '@/lib/api/server';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './product-detail-client';
import { Product } from '@/lib/api/types';

export async function generateStaticParams() {
  try {
    const { data: products } = await getProducts({ limit: 100 });
    return products.map((product: Product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  try {
    const product = await getProduct(slug);
    
    if (!product) {
      notFound();
    }

    // Format the date on the server to avoid hydration mismatch
    const formattedDate = new Date(product.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    return <ProductDetailClient product={product} formattedDate={formattedDate} />;
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}