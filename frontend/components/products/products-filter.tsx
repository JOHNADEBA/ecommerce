'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export function ProductsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (search.trim()) params.set('search', search.trim());
    if (category.trim()) params.set('category', category.trim());
    
    // Only add price filters if they are valid numbers
    if (minPrice && !isNaN(Number(minPrice)) && Number(minPrice) >= 0) {
      params.set('minPrice', Number(minPrice).toString());
    }
    
    if (maxPrice && !isNaN(Number(maxPrice)) && Number(maxPrice) >= 0) {
      params.set('maxPrice', Number(maxPrice).toString());
    }
    
    // Ensure minPrice <= maxPrice
    if (params.get('minPrice') && params.get('maxPrice')) {
      const min = Number(params.get('minPrice'));
      const max = Number(params.get('maxPrice'));
      if (min > max) {
        // Swap them if invalid
        params.set('minPrice', max.toString());
        params.set('maxPrice', min.toString());
      }
    }
    
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    router.push('/products');
  };

  // Validate price inputs
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMaxPrice(value);
    }
  };

  return (
    <div className="bg-muted/50 p-4 rounded-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category */}
        <Input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* Min Price */}
        <Input
          type="text"
          placeholder="Min price"
          value={minPrice}
          onChange={handleMinPriceChange}
        />

        {/* Max Price */}
        <Input
          type="text"
          placeholder="Max price"
          value={maxPrice}
          onChange={handleMaxPriceChange}
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={clearFilters} size="sm">
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
        <Button onClick={applyFilters} size="sm">
          <Search className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
}