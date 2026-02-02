'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SecretRoomContent } from '@/types';
import { FiLock, FiUnlock } from 'react-icons/fi';

export default function SecretRoomPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [content, setContent] = useState<SecretRoomContent[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_SECRET_ROOM_PASSWORD) {
      setIsUnlocked(true);
      setError('');
      fetchContent();
    } else {
      setError('Неверный пароль. Попробуй еще раз, любимый.');
      setPassword('');
    }
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'secretRoom'));
      const contentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SecretRoomContent[];
      setContent(contentData);
    } catch (error) {
      console.error('Error fetching secret room content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            {isUnlocked ? (
              <FiUnlock className="text-white text-4xl" />
            ) : (
              <FiLock className="text-white text-4xl" />
            )}
          </div>
          <h1 className="section-title text-purple-700">Секретная комната</h1>
          <p className="text-xl text-gray-600">
            {isUnlocked
              ? 'Добро пожаловать в наше самое личное пространство ♥'
              : 'Пароль защищает наши самые интимные моменты'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md mx-auto"
            >
              <div className="romantic-card">
                <h2 className="text-2xl font-display font-semibold text-purple-700 text-center mb-6">
                  Введи секретный пароль
                </h2>
                <form onSubmit={handleUnlock} className="space-y-4">
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="romantic-input pl-12"
                      placeholder="Пароль..."
                      autoFocus
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-600 text-sm text-center"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button type="submit" className="w-full romantic-button">
                    Открыть
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-purple-100">
                  <p className="text-sm text-gray-500 text-center italic">
                    Подсказка: Пароль — это то, что знаем только мы ✨
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
              ) : content.length === 0 ? (
                <div className="romantic-card text-center py-12">
                  <p className="text-gray-600 text-lg">
                    Это пространство готовится с нашими самыми ценными воспоминаниями... 💜
                  </p>
                </div>
              ) : (
                content.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="romantic-card bg-gradient-to-br from-purple-50 to-pink-50"
                  >
                    <h3 className="text-3xl font-display font-bold text-purple-700 mb-4">
                      {item.title}
                    </h3>
                    <div className="prose-romantic mb-6">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.content.replace(/\n/g, '<br />'),
                        }}
                      />
                    </div>

                    {item.mediaUrls && item.mediaUrls.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                        {item.mediaUrls.map((url, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (index * 0.2) + (idx * 0.1) }}
                            className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                          >
                            <img
                              src={url}
                              alt={`Воспоминание ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              )}

              <div className="text-center">
                <button
                  onClick={() => setIsUnlocked(false)}
                  className="text-purple-600 hover:text-purple-700 transition-colors text-sm"
                >
                  Закрыть комнату
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
