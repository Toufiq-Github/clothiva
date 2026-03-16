import type { Category, Color, Size } from './types';

export const colors: Color[] = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Cream', hex: '#f5f5dc' },
  { name: 'Pink', hex: '#f9a8d4' },
  { name: 'Yellow', hex: '#facc15' },
  { name: 'Gray', hex: '#808080' },
];

export const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', '2T', '3T', '4T', '5T'];

export const categories: Category[] = [
  { id: 'cat-women', name: 'Women', slug: 'women' },
  { id: 'cat-men', name: 'Men', slug: 'men' },
  { id: 'cat-kids', name: 'Kids', slug: 'kids' },
];
