'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getImageUrl, getImageHint } from '@/lib/utils';

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Shopping Cart ({items.length})</SheetTitle>
        </SheetHeader>
        <Separator />
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-6 p-6 pr-6">
                {items.map((item) => {
                    const imageUrl = getImageUrl(item.product.images[0]);
                    const imageHint = getImageHint(item.product.images[0]);
                    return (
                        <div key={item.id} className="flex items-start gap-4">
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                                {imageUrl &&
                                <Image
                                    src={imageUrl}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={imageHint}
                                />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.product.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {item.size} / {item.color.name}
                                </p>
                                <p className="mt-1 font-medium">৳{item.product.price.toFixed(2)}</p>
                                <div className="mt-2 flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground"
                                onClick={() => removeFromCart(item.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )
                })}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="bg-secondary p-6">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>৳{totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes will be calculated at checkout.
                </p>
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-20 w-20 text-muted-foreground/50" />
            <h3 className="font-semibold text-xl">Your cart is empty</h3>
            <p className="text-muted-foreground">
              Looks like you haven&apos;t added anything yet.
            </p>
            <SheetTrigger asChild>
                <Button asChild>
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
