'use client';

import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import BackButton from '@/components/BackButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute adminOnly>
      <div className="flex min-h-screen">
        <Navigation />
        <main className="flex-1 lg:ml-0 p-4 main-content-padding lg:p-8">
          <div className="max-w-4xl mx-auto">
            <BackButton />
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
