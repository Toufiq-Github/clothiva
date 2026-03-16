'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getImageUrl, getImageHint } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isUserLoading, firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
      if (!isUserLoading && !user) {
          router.push('/login?redirect=/checkout');
      }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <p>Loading...</p>
        </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-headline text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some products to proceed to checkout.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }
  
  const shippingCost = 500.00;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shippingCost + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user) return;

    setIsPlacingOrder(true);
    
    const newOrder = {
      userId: user.uid,
      customerName: user.displayName || 'Anonymous',
      customerEmail: user.email || 'anonymous',
      date: new Date().toISOString(),
      total: total,
      status: 'Paid' as const,
      items: items,
    };

    try {
        const ordersCollection = collection(firestore, 'users', user.uid, 'orders');
        const docRef = await addDocumentNonBlocking(ordersCollection, newOrder);
        clearCart();
        toast({
            title: "Order Placed!",
            description: "Thank you for your purchase.",
        });
        router.push(`/checkout/success?orderId=${docRef.id}`);
    } catch(error: any) {
        toast({
            variant: "destructive",
            title: "Order Failed",
            description: "There was a problem placing your order. Please try again.",
        });
        setIsPlacingOrder(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-headline text-4xl font-bold text-center mb-10">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold font-headline mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="John" required defaultValue={user.displayName?.split(' ')[0]} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Doe" required defaultValue={user.displayName?.split(' ').slice(1).join(' ')} />
              </div>
              <div className="sm:col-span-2 grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main St" required />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Anytown" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" placeholder="CA" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zip">ZIP / Postal code</Label>
                <Input id="zip" placeholder="12345" required />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold font-headline mb-4">Payment Information</h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="card-number">Card number</Label>
                <Input id="card-number" placeholder="**** **** **** 1234" required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="expiry-date">Expiration date (MM/YY)</Label>
                  <Input id="expiry-date" placeholder="MM/YY" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" required />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 lg:mt-0">
            <div className="border bg-card rounded-lg p-6 sticky top-24">
                <h2 className="text-2xl font-semibold font-headline mb-4">Order Summary</h2>
                <div className="space-y-4">
                    {items.map(item => {
                        const imageUrl = getImageUrl(item.product.images[0]);
                        const imageHint = getImageHint(item.product.images[0]);
                        return (
                            <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                        {imageUrl && <Image src={imageUrl} alt={item.product.name} fill className="object-cover" data-ai-hint={imageHint} />}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{item.product.name}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium">৳{(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                        )
                    })}
                </div>
                <Separator className="my-6" />
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Subtotal</p>
                        <p>৳{totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Shipping</p>
                        <p>৳{shippingCost.toFixed(2)}</p>
                    </div>
                     <div className="flex justify-between">
                        <p className="text-muted-foreground">Taxes</p>
                        <p>৳{tax.toFixed(2)}</p>
                    </div>
                </div>
                <Separator className="my-6" />
                <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>৳{total.toFixed(2)}</p>
                </div>
                 <Button type="submit" size="lg" className="w-full mt-6" disabled={isPlacingOrder}>
                    {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                </Button>
            </div>
        </div>
      </form>
    </div>
  );
}
