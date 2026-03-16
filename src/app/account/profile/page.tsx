'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
    const { user, updateProfile, updatePassword } = useAuth();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateProfile(name, email);
    }

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd verify the current password first.
        // For this localStorage-based system, we'll skip that check.
        if (newPassword.length < 6) {
             toast({ variant: 'destructive', title: 'Error', description: 'New password must be at least 6 characters long.' });
             return;
        }
        if (newPassword !== confirmPassword) {
            toast({ variant: 'destructive', title: 'Error', description: 'New passwords do not match.' });
            return;
        }
        const success = await updatePassword(newPassword);
        if (success) {
            setNewPassword('');
            setConfirmPassword('');
        }
    }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Welcome, {user?.name}!</CardTitle>
                <CardDescription>
                    Here you can manage your personal information and password.
                </CardDescription>
            </CardHeader>
        </Card>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your name and email address. Email updates are disabled for this demo.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileUpdate}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled />
            </div>
            </CardContent>
            <CardFooter>
            <Button type="submit">Save Changes</Button>
            </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            For your security, we recommend choosing a strong password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordUpdate}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            </CardContent>
            <CardFooter>
            <Button type="submit">Update Password</Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  )
}
