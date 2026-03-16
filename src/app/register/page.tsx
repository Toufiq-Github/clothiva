'use client';

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const bgImage = PlaceHolderImages.find(p => p.id === 'login-bg');
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
        return;
    }
    if (password.length < 6) {
        toast({ variant: 'destructive', title: 'Error', description: 'Password must be at least 6 characters long.' });
        return;
    }
    const success = register(name, email, password);
    if (success) {
        router.push('/login');
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="first-name">Name</Label>
                    <Input id="first-name" placeholder="Max" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full">
                    Create an account
                </Button>
                </div>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
       <div className="hidden bg-muted lg:block relative">
        {bgImage && (
          <Image
            src={bgImage.imageUrl}
            alt="Fashion background"
            fill
            className="object-cover dark:brightness-[0.3]"
            data-ai-hint={bgImage.imageHint}
          />
        )}
      </div>
    </div>
  )
}
