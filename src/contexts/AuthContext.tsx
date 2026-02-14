'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, signIn, signOut, getCurrentUser } from '@/lib/auth';
import { User } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const initializeAuth = () => {
      try {
        const currentUser = getCurrentUser();
        if (!cancelled) setUser(currentUser);
      } catch (e) {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initializeAuth();
    const fallback = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(fallback);
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const authUser = await signIn(email, password);
      setUser(authUser);
    } catch (error) {
      throw error;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
