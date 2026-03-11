import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackageX } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      <PackageX className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
      <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
      <p className="text-muted-foreground mb-8">
        Sorry, we couldn't find the product you're looking for. It might have been removed or the URL might be incorrect.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}