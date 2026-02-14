'use client';

import { useRouter, usePathname } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <div className="mb-2 flex items-center">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-pastel-pink-600 transition-colors font-medium"
        aria-label="Назад"
      >
        <FiArrowLeft size={20} />
        <span>Назад</span>
      </button>
    </div>
  );
}
