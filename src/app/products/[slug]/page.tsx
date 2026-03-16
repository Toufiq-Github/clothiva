'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, Truck, CheckCircle } from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import type { Product, Size, Color } from '@/lib/types';
import { cn, getImageUrl, getImageHint } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { firestore } = useFirebase();
  const productQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'products'), where('slug', '==', slug)) : null, 
    [firestore, slug]
  );
  const { data: products, isLoading } = useCollection<Product>(productQuery);
  const product = products?.[0];

  const [selectedSize, setSelectedSize] = useState<Size | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<Color | undefined>(undefined);
  const { addToCart } = useCart();

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
                 <div>
                    <Skeleton className="aspect-[3/4] w-full rounded-lg"/>
                 </div>
                 <div className="space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-8 w-1/3" />
                    <div className="py-6 space-y-4">
                        <Skeleton className="h-6 w-1/4" />
                        <div className="flex gap-2">
                           <Skeleton className="h-10 w-16" />
                           <Skeleton className="h-10 w-16" />
                           <Skeleton className="h-10 w-16" />
                        </div>
                    </div>
                     <Skeleton className="h-12 w-full" />
                 </div>
            </div>
        </div>
    )
  }

  if (!product) {
    notFound();
  }
  
  const productImages = product.images.map(img => ({
      url: getImageUrl(img),
      hint: getImageHint(img)
  }));

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
        <div className="md:sticky md:top-20 md:self-start">
           <Carousel className="w-full">
                <CarouselContent>
                    {productImages.length > 0 ? productImages.map((image, index) => (
                        <CarouselItem key={index}>
                            <Card className="overflow-hidden">
                                <CardContent className="p-0 aspect-[3/4] relative">
                                    {image && <Image
                                        src={image.url}
                                        alt={`${product.name} - image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={image.hint}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />}
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    )) : (
                         <CarouselItem>
                            <Card className="overflow-hidden">
                                <CardContent className="p-0 aspect-[3/4] relative bg-muted"/>
                            </Card>
                        </CarouselItem>
                    )}
                </CarouselContent>
                {productImages.length > 1 && <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                </>}
            </Carousel>
        </div>

        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 text-muted-foreground fill-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">(12 reviews)</span>
          </div>
          <p className="mt-4 text-3xl font-bold">৳{product.price.toFixed(2)}</p>

          <Separator className="my-6" />

          {selectedColor && <div>
            <h3 className="text-sm font-semibold mb-2">Color: <span className="font-normal text-muted-foreground">{selectedColor.name}</span></h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'h-8 w-8 rounded-full border-2 transition-transform duration-100 ease-in-out',
                    selectedColor.name === color.name
                      ? 'border-primary scale-110'
                      : 'border-transparent'
                  )}
                  aria-label={`Select color ${color.name}`}
                >
                  <span
                    className="block h-full w-full rounded-full border border-border"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              ))}
            </div>
          </div>}

          {selectedSize && <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  onClick={() => setSelectedSize(size)}
                  className="w-16"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>}

          <Button
            size="lg"
            className="mt-8 w-full"
            onClick={() => selectedSize && selectedColor && addToCart(product, selectedSize, selectedColor)}
            disabled={!selectedSize || !selectedColor}
          >
            Add to Cart
          </Button>

          <div className="mt-6 space-y-4 text-sm text-muted-foreground">
             <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>In Stock: {product.stock} items</span>
             </div>
             <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Free shipping on orders over ৳5000</span>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold mb-2">Product Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
