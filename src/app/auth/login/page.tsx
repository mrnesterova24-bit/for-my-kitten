'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiHeart, FiLock, FiMail } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const parsed = JSON.parse(token);
      if (parsed?.uid) {
        router.push('/');
        return;
      }
    } catch {
      localStorage.removeItem('auth_token');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Введите email и пароль');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.push('/');
    } catch (err: unknown) {
      setError('Неверный email или пароль');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pastel-pink-50 via-white to-pastel-mint-50"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
      }}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute text-pastel-pink-200 text-2xl opacity-60"
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${15 + (i % 5) * 18}%`,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10 bg-white rounded-2xl shadow-xl border-2 border-pastel-blue-100 p-8">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-pastel-pink-500 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
            <FiHeart className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-pastel-pink-700 mb-2">
            Вход
          </h1>
          <p className="text-gray-600 mb-4">
            Этот раздел для меня)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-pastel-pink-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-pastel-blue-200 rounded-xl bg-white focus:outline-none focus:border-pastel-pink-400"
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-pastel-pink-400" />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-pastel-blue-200 rounded-xl bg-white focus:outline-none focus:border-pastel-pink-400"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-pastel-pink-500 hover:bg-pastel-pink-600 text-white font-semibold rounded-xl disabled:opacity-50"
          >
            {loading ? 'Вхожу...' : 'Войти'}
          </button>
        </form>

      </div>
    </div>
  );
}
