'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (adminOnly && !isAdmin) {
        router.push('/');
      }
    }
  }, [user, loading, isAdmin, adminOnly, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-pink-50 via-white to-pastel-mint-50 p-4"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
        }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pastel-pink-200 border-t-pastel-pink-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-pastel-pink-700 font-medium">Загружаю...</p>
        </div>
      </div>
    );
  }

  if (!user || (adminOnly && !isAdmin)) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pastel-pink-50 via-white to-pastel-mint-50"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.5rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.5rem)',
        }}
      >
        <p className="text-gray-600 mb-4">Перенаправление на вход...</p>
        <div className="w-10 h-10 border-4 border-pastel-pink-200 border-t-pastel-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
