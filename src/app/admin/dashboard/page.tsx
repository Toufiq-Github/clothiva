
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Users, CreditCard, Activity, ShoppingBag, Database } from "lucide-react"
import { useToast } from '@/hooks/use-toast';
import { sizes, colors } from '@/lib/data';

export default function DashboardPage() {
    const { getUsers } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [userCount, setUserCount] = useState(0);
    const [isSeeding, setIsSeeding] = useState(false);

    useEffect(() => {
        setUserCount(0); 
    }, []);

    const seedSampleProducts = async () => {
        if (!firestore) return;
        setIsSeeding(true);

        const sampleProducts = [
            {
                name: "Premium Formal Shirt",
                slug: "premium-formal-shirt",
                description: "A crisp, professional formal shirt made from 100% premium cotton. Perfect for office wear and special occasions. Features a slim fit design and durable buttons.",
                price: 1800,
                stock: 25,
                category: "men",
                sizes: sizes,
                colors: colors,
                images: ["prod-13-1"]
            },
            {
                name: "Classic Tailored Pant",
                slug: "classic-tailored-pant",
                description: "High-quality tailored trousers with a modern fit. Versatile enough for both formal and semi-formal settings. Breathable fabric ensures all-day comfort.",
                price: 2200,
                stock: 15,
                category: "men",
                sizes: sizes,
                colors: colors,
                images: ["prod-12-1"]
            },
            {
                name: "Elegant Winter Coat",
                slug: "elegant-winter-coat",
                description: "Get your comfort with this stylish and warm elegant winter coat. Crafted with a high-quality wool blend, it offers both luxury and protection against the cold.",
                price: 5000,
                stock: 10,
                category: "women",
                sizes: sizes,
                colors: colors,
                images: ["prod-3-1"]
            }
        ];

        try {
            const productsCol = collection(firestore, 'products');
            for (const product of sampleProducts) {
                addDocumentNonBlocking(productsCol, product);
            }
            toast({
                title: "Products Seeded",
                description: "Formal Shirt, Pant, and Coat have been added to your catalog.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Seeding Failed",
                description: "Could not add sample products.",
            });
        } finally {
            setIsSeeding(false);
        }
    };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <Button 
            onClick={seedSampleProducts} 
            disabled={isSeeding}
            variant="outline"
            className="gap-2"
        >
            <Database className="h-4 w-4" />
            {isSeeding ? 'Seeding...' : 'Seed Sample Products'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳0.00</div>
            <p className="text-xs text-muted-foreground">
              Connect to a payment gateway to see revenue.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{userCount}</div>
            <p className="text-xs text-muted-foreground">
              Total registered users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+0</div>
            <p className="text-xs text-muted-foreground">
              Total orders placed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics Widget</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              Dummy usage stats
            </p>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              A quick look at the most recent orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <ShoppingBag className="h-20 w-20 text-muted-foreground/50" />
                <h3 className="font-semibold text-xl">No Orders Yet</h3>
                <p className="text-muted-foreground max-w-md">
                 When customers place orders, they will appear here. Viewing all user orders requires special admin permissions and is not supported in this view.
                </p>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
