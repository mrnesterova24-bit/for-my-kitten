'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pastel-pink-50 via-white to-pastel-mint-50">
      <h2 className="text-2xl font-bold text-pastel-pink-700 mb-4">Что-то пошло не так</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-pastel-pink-500 text-white rounded-xl font-semibold hover:bg-pastel-pink-600 transition-colors"
      >
        Попробовать снова
      </button>
    </div>
  );
}
