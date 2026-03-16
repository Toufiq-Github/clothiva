'use client';

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, FormEvent } from "react";
import { useFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <Link href="#" className="text-muted-foreground hover:text-foreground">
      {children}
    </Link>
  );
}

export function AppFooter() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !firestore) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }
    setIsLoading(true);

    const inquiriesCollection = collection(firestore, 'inquiries');
    addDoc(inquiriesCollection, {
      email: email,
      submittedAt: serverTimestamp(),
    }).then(() => {
      toast({
        title: "Subscribed!",
        description: "Thanks for joining our newsletter.",
      });
      setEmail('');
    }).catch((error) => {
      console.error("Error submitting inquiry: ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not subscribe. Please try again later.",
      });
    }).finally(() => {
      setIsLoading(false);
    });
  };


  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <h3 className="font-headline text-xl font-bold mb-2">Clothiva</h3>
            <p className="text-muted-foreground text-sm">
              Effortless elegance for the modern individual.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-4">
            <div>
              <h4 className="font-semibold mb-2">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products" className="text-muted-foreground hover:text-foreground">All Products</Link></li>
                <li><Link href="/products?category=women" className="text-muted-foreground hover:text-foreground">Women</Link></li>
                <li><Link href="/products?category=men" className="text-muted-foreground hover:text-foreground">Men</Link></li>
                <li><Link href="/products?category=kids" className="text-muted-foreground hover:text-foreground">Kids</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">About Us</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Our Story</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/account" className="text-muted-foreground hover:text-foreground">My Account</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Shipping & Returns</Link></li>
                <li><Link href="/admin/login" className="text-muted-foreground hover:text-foreground">Admin Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Stay Connected</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Join our newsletter for updates on new arrivals and sales.
              </p>
              <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-background"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Clothiva. All Rights Reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <SocialIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </SocialIcon>
            <SocialIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </SocialIcon>
            <SocialIcon>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
}
