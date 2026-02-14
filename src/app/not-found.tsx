import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pastel-pink-50 via-white to-pastel-mint-50">
      <h1 className="text-4xl font-bold text-pastel-pink-700 mb-2">404</h1>
      <p className="text-gray-600 mb-6">Такой страницы нет</p>
      <Link
        href="/"
        className="px-6 py-3 bg-pastel-pink-500 text-white rounded-xl font-semibold hover:bg-pastel-pink-600 transition-colors"
      >
        На главную
      </Link>
    </div>
  );
}
