'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
    User as FirebaseUser, 
    signOut, 
    updateProfile as firebaseUpdateProfile, 
    updatePassword as firebaseUpdatePassword,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  admin: boolean;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  getUsers: () => any[]; 
  deleteUser: (email: string) => void; 
  isUserLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, user: firebaseUser, isUserLoading, userError } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (isUserLoading) return;
    if (firebaseUser) {
      setUser({
        name: firebaseUser.displayName || firebaseUser.email || 'Anonymous',
        email: firebaseUser.email!,
      });
    } else {
      setUser(null);
    }
  }, [firebaseUser, isUserLoading]);

  useEffect(() => {
    if (userError) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: userError.message });
    }
  }, [userError, toast]);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('clothiva_admin');
    if (storedAdmin === 'true') {
        setAdmin(true);
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (!auth) return;
    signInWithEmailAndPassword(auth, email, password)
        .catch((error: any) => {
            toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
        });
  }, [auth, toast]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    if (!auth) return;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await firebaseUpdateProfile(userCredential.user, { displayName: name });
        toast({ title: 'Registration Successful', description: 'You can now log in.' });
        router.push('/login');
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Registration Failed', description: error.message });
      }
  }, [auth, router, toast]);

  const logout = useCallback(() => {
    if (!auth) return;
    signOut(auth).then(() => {
        toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
        router.push('/');
    });
  }, [auth, router, toast]);
  
  const adminLogin = useCallback((password: string): boolean => {
      if (password === 'admin123') {
          localStorage.setItem('clothiva_admin', 'true');
          setAdmin(true);
          toast({ title: 'Admin Login Successful' });
          return true;
      }
      toast({ variant: 'destructive', title: 'Admin Login Failed', description: 'Incorrect password.' });
      return false;
  }, [toast]);

  const adminLogout = useCallback(() => {
      localStorage.removeItem('clothiva_admin');
      setAdmin(false);
      toast({ title: 'Admin Logged Out' });
      router.push('/admin/login');
  }, [router, toast]);

  const updateProfile = useCallback(async (name: string, email: string): Promise<boolean> => {
    if (!auth?.currentUser) return false;
    try {
      await firebaseUpdateProfile(auth.currentUser, { displayName: name });
      toast({ title: "Profile Updated", description: "Your name has been updated." });
      setUser(u => u ? { ...u, name } : null);
      return true;
    } catch(e: any) {
      toast({ variant: "destructive", title: "Update Failed", description: e.message });
      return false;
    }
  }, [auth, toast]);

  const updatePassword = useCallback(async (newPassword: string): Promise<boolean> => {
    if (!auth?.currentUser) return false;
    try {
      await firebaseUpdatePassword(auth.currentUser, newPassword);
      toast({ title: "Password Updated", description: "Your password has been changed successfully." });
      return true;
    } catch(e: any) {
      toast({ variant: "destructive", title: "Update Failed", description: e.message });
      return false;
    }
  }, [auth, toast]);

  const getUsers = () => {
    console.warn("getUsers is deprecated. User management is now handled by Firebase.");
    return [];
  };
  const deleteUser = () => {
    console.warn("deleteUser is deprecated. User management is now handled by Firebase.");
  };

  const contextValue = {
      user,
      firebaseUser,
      admin,
      login,
      register,
      logout,
      updateProfile,
      updatePassword,
      adminLogin,
      adminLogout,
      getUsers,
      deleteUser,
      isUserLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
