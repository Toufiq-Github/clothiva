export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: Size[];
  colors: Color[];
  stock: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Color = {
  name: string;
  hex: string;
};

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2T' | '3T' | '4T' | '5T';

export type CartItem = {
  id: string;
  product: Product;
  size: Size;
  color: Color;
  quantity: number;
};

export type Order = {
  id?: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
};

export type User = {
    name: string;
    email: string;
};
