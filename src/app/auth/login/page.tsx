
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiHeart, FiLock, FiMail } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Проверяем временный токен при загрузке страницы
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Временное отключение аутентификации для тестирования
      // await signIn(email, password);
      // router.push('/');
      
      // Прямой вход без аутентификации
      localStorage.setItem('auth_token', 'test_token');
      window.location.href = '/';
    } catch (err: any) {
      setError('Неверный email или пароль. Попробуйте снова.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-200 text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          >
            ♥
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="romantic-card text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6 flex justify-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-pastel-pink-400 to-pastel-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <FiHeart className="text-white text-4xl" />
            </div>
          </motion.div>

          <h1 className="text-4xl font-display font-bold text-rose-700 mb-2">
            Добро пожаловать
          </h1>
          <p className="text-gray-600 mb-8">
            Войдите в это священное пространство
          </p>
          <div className="text-xs text-gray-500 mb-4">
            Для входа используйте email: {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
          </div>
          <div className="text-xs text-gray-500 mb-4">
            Пароль: love
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="romantic-input pl-12"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="romantic-input pl-12"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-rose-600 text-sm"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full romantic-button disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-pastel-pink-400 to-pastel-purple-500"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Вхожу...
                </span>
              ) : (
                'Войти в наше пространство'
              )}
            </button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-sm text-gray-500 italic"
          >
            "В этом пространстве ты всегда дома"
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
