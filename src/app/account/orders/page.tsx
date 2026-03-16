'use client';

import Link from "next/link";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { Order } from "@/lib/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersPage() {
    const { firestore, user } = useFirebase();
    
    const ordersQuery = useMemoFirebase(() => 
        user && firestore 
            ? query(collection(firestore, 'users', user.uid, 'orders'), orderBy('date', 'desc')) 
            : null, 
        [firestore, user]
    );

    const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
        <CardDescription>A list of your past orders.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
             <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        ) : orders && orders.length > 0 ? (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead><span className="sr-only">View</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map(order => (
                <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id.substring(0, 7)}</TableCell>
                    <TableCell suppressHydrationWarning>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                    <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>৳{order.total.toFixed(2)}</TableCell>
                    <TableCell>
                    <Button asChild variant="ghost" size="icon">
                        <Link href={`/account/orders/${order.id}`}>
                        <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <ShoppingBag className="h-20 w-20 text-muted-foreground/50" />
                <h3 className="font-semibold text-xl">No Orders Yet</h3>
                <p className="text-muted-foreground">
                You haven&apos;t placed any orders with us.
                </p>
                <Button asChild>
                    <Link href="/products">Start Shopping</Link>
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
