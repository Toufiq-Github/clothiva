'use client';
import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const successImage = PlaceHolderImages.find(p => p.id === 'checkout-success');

    return (
        <Card className="max-w-md w-full text-center">
            <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="font-headline text-3xl font-bold">Thank you for your order!</h1>
                <p className="mt-2 text-muted-foreground">
                    Your order has been successfully placed. You will receive an email confirmation shortly.
                </p>
                {orderId && <p className="mt-4 font-semibold">Order #{orderId.substring(0, 7)}</p>}
                
                {successImage && (
                    <div className="my-6 relative aspect-video w-full rounded-lg overflow-hidden">
                        <Image 
                            src={successImage.imageUrl} 
                            alt="Thank you for shopping" 
                            fill 
                            className="object-cover" 
                            data-ai-hint={successImage.imageHint}
                        />
                    </div>
                )}
                
                <Button asChild className="mt-6 w-full">
                    <Link href="/products">Continue Shopping</Link>
                </Button>
                 <Button variant="outline" asChild className="mt-2 w-full">
                    <Link href="/account/orders">View My Orders</Link>
                </Button>
            </CardContent>
        </Card>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
