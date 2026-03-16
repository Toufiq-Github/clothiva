import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(imageIdOrUrl: string): string {
    if (!imageIdOrUrl) {
        return `https://placehold.co/600x400?text=No+Image`;
    }
    if (imageIdOrUrl.startsWith('http') || imageIdOrUrl.startsWith('data:')) {
        return imageIdOrUrl;
    }
    const placeholder = PlaceHolderImages.find(p => p.id === imageIdOrUrl);
    return placeholder ? placeholder.imageUrl : `https://placehold.co/600x400?text=Image+Not+Found`;
}

export function getImageHint(imageIdOrUrl: string): string {
    if (!imageIdOrUrl || imageIdOrUrl.startsWith('http') || imageIdOrUrl.startsWith('data:')) {
        // For external URLs or data URIs, we can't know the content, so provide a generic hint.
        return 'product image';
    }
    const placeholder = PlaceHolderImages.find(p => p.id === imageIdOrUrl);
    return placeholder ? placeholder.imageHint : 'product';
}
