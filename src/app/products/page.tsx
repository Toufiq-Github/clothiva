'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { categories, sizes, colors } from '@/lib/data';
import { ProductCard } from '@/components/app/product-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { firestore } = useFirebase();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);
  
  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    let q = query(collection(firestore, 'products'));

    if (selectedCategories.length > 0) {
      q = query(q, where('category', 'in', selectedCategories));
    }
    if (priceRange[0] > 0) {
      q = query(q, where('price', '>=', priceRange[0]));
    }
    if (priceRange[1] < 30000) {
        q = query(q, where('price', '<=', priceRange[1]));
    }
    if (selectedSizes.length > 0) {
        q = query(q, where('sizes', 'array-contains-any', selectedSizes));
    }
    
    // Firestore doesn't support inequality filters on multiple fields, or complex array queries.
    // Client-side filtering is needed for some criteria.
    
    if (sortBy === 'price-asc') {
        q = query(q, orderBy('price', 'asc'));
    } else if (sortBy === 'price-desc') {
        q = query(q, orderBy('price', 'desc'));
    }

    return q;
  }, [firestore, selectedCategories, priceRange, selectedSizes, sortBy]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };
  
  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((product) =>
        selectedColors.length === 0 || selectedColors.some(color => product.colors.map(c => c.name).includes(color))
      );
  }, [products, searchTerm, selectedColors]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Collection</h1>
        <p className="mt-2 text-muted-foreground">Find your next favorite piece.</p>
      </header>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            <h2 className="font-headline text-2xl font-semibold">Filters</h2>
            <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
              <AccordionItem value="category">
                <AccordionTrigger className="font-semibold">Category</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cat-${category.slug}`}
                          checked={selectedCategories.includes(category.slug)}
                          onCheckedChange={() => handleCategoryChange(category.slug)}
                        />
                        <Label htmlFor={`cat-${category.slug}`}>{category.name}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="price">
                <AccordionTrigger className="font-semibold">Price</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[0, 30000]}
                      min={0}
                      max={30000}
                      step={1000}
                      onValueCommit={setPriceRange}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>৳{priceRange[0]}</span>
                      <span>৳{priceRange[1]}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="size">
                <AccordionTrigger className="font-semibold">Size</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                         <Checkbox
                          id={`size-${size}`}
                          checked={selectedSizes.includes(size)}
                          onCheckedChange={() => handleSizeChange(size)}
                        />
                        <Label htmlFor={`size-${size}`}>{size}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="color">
                <AccordionTrigger className="font-semibold">Color</AccordionTrigger>
                <AccordionContent>
                   <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <div key={color.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`color-${color.name}`}
                          checked={selectedColors.includes(color.name)}
                          onCheckedChange={() => handleColorChange(color.name)}
                        />
                        <Label htmlFor={`color-${color.name}`} className="flex items-center gap-2">
                           <span
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <Input
              placeholder="Search products..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
           {isLoading ? (
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
             </div>
           ) : (
            <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {filteredProducts.length === 0 && (
                <div className="text-center py-20 col-span-full">
                    <h2 className="font-headline text-2xl font-semibold">No products found</h2>
                    <p className="mt-2 text-muted-foreground">Try adjusting your filters.</p>
                </div>
            )}
            </>
           )}
        </main>
      </div>
    </div>
  );
}
