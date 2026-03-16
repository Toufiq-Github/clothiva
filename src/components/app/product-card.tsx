import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { getImageUrl, getImageHint } from '@/lib/utils';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getImageUrl(product.images[0]);
  const imageHint = getImageHint(product.images[0]);
  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <CardContent className="p-0">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={imageHint}
              />
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold truncate">{product.name}</h3>
            <p className="mt-2 text-muted-foreground">৳{product.price.toFixed(2)}</p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
