'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem, Product, Size, Color } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: Size, color: Color) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, size: Size, color: Color) => {
    const existingItemIndex = items.findIndex(
      (item) => item.product.id === product.id && item.size === size && item.color.name === color.name
    );

    if (existingItemIndex > -1) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity += 1;
      setItems(newItems);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${size}-${color.name}`,
        product,
        size,
        color,
        quantity: 1,
      };
      setItems([...items, newItem]);
    }
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    })
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setItems(newItems);
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
