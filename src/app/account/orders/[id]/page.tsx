'use client';
import Image from "next/image";
import { notFound } from "next/navigation";
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Order } from "@/lib/types";
import { use } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getImageUrl, getImageHint } from "@/lib/utils";
import { Truck, Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { firestore, user } = useFirebase();
  const orderDocRef = useMemoFirebase(() => 
    user && firestore ? doc(firestore, 'users', user.uid, 'orders', id) : null,
    [firestore, user, id]
  );
  const { data: order, isLoading } = useDoc<Order>(orderDocRef);

  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    )
  }

  if (!order) {
    notFound();
  }
  
  const shippingCost = 500.00;
  const tax = order.total * 0.08;
  const subtotal = order.total - shippingCost - tax;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order #{order.id?.substring(0, 7)}</CardTitle>
          <CardDescription suppressHydrationWarning>
            Order placed on {new Date(order.date).toLocaleDateString()}
          </CardDescription>
          <div className="pt-2">
            <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map(item => {
              const imageUrl = getImageUrl(item.product.images[0]);
              const imageHint = getImageHint(item.product.images[0]);
              return (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      {imageUrl && <Image src={imageUrl} alt={item.product.name} fill className="object-cover" data-ai-hint={imageHint}/>}
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
        </CardContent>
        <CardFooter>
            <div className="w-full space-y-2">
                <Separator />
                <div className="flex justify-between"><p className="text-muted-foreground">Subtotal</p><p>৳{subtotal.toFixed(2)}</p></div>
                <div className="flex justify-between"><p className="text-muted-foreground">Shipping</p><p>৳{shippingCost.toFixed(2)}</p></div>
                <div className="flex justify-between"><p className="text-muted-foreground">Taxes</p><p>৳{tax.toFixed(2)}</p></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg"><p>Total</p><p>৳{order.total.toFixed(2)}</p></div>
            </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Home className="w-5 h-5" /> Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
            <p>{order.customerName}</p>
            <p>123 Dream Lane</p>
            <p>Los Angeles, CA 90210</p>
            <p>United States</p>
        </CardContent>
      </Card>

    </div>
  );
}
