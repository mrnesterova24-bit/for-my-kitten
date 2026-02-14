'use client';

import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 min-w-0 min-h-screen p-4 main-content-padding lg:p-8 bg-gradient-to-br from-pastel-pink-50/50 via-white to-pastel-mint-50/50">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          {children}
        </div>
      </main>
    </div>
  );
}
