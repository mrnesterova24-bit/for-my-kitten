'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SecretRoomPhoto } from '@/types';
import { FiLock, FiUnlock, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function SecretRoomPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<SecretRoomPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIndex !== null) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, photos.length]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = password.trim().toLowerCase();
    if (entered === 'жорик') {
      setIsUnlocked(true);
      setError('');
      fetchPhotos();
    } else {
      setError('Неверный пароль. Попробуй еще раз, любимый.');
      setPassword('');
    }
  };

  const shuffle = <T,>(arr: T[]): T[] => {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };

  const toImageUrl = (url: string) =>
    url.startsWith('/uploads/') ? url.replace('/uploads/', '/api/uploads/') : url;

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/secret-room');
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setPhotos(shuffle(list));
    } catch (err) {
      console.error(err);
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
          <h1 className="section-title text-pastel-pink-700">Секретная комната</h1>
          <p className="text-xl text-gray-600">
            {isUnlocked
              ? 'Добро пожаловать в наше самое личное пространство ♥'
              : 'Пароль защищает наши самые интимные моменты'}
          </p>
          {isUnlocked && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              Я собрала здесь все фото, которые были в нашем чате. В дальнейшем этот раздел будет дополняться😈
            </p>
          )}
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
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 text-sm text-center">
                      {error}
                    </motion.p>
                  )}
                  <button type="submit" className="w-full romantic-button">
                    Открыть
                  </button>
                </form>
                <div className="mt-6 pt-6 border-t border-purple-100">
                  <p className="text-sm text-gray-500 text-center italic">
                    Подсказка: Как будут звать нашу собаку?
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
                  <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : photos.length === 0 ? (
                <div className="romantic-card text-center py-12">
                  <p className="text-gray-600 text-lg">
                    Здесь пока нет фото. Скоро появятся 💜
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, idx) => (
                    <motion.button
                      type="button"
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
                      onClick={() => setLightboxIndex(idx)}
                    >
                      <img
                        src={toImageUrl(photo.url)}
                        alt=""
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </motion.button>
                  ))}
                </div>
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

        <AnimatePresence>
          {lightboxIndex !== null && photos[lightboxIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={() => setLightboxIndex(null)}
            >
              <button
                type="button"
                aria-label="Закрыть"
                className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
                onClick={() => setLightboxIndex(null)}
              >
                <FiX size={28} />
              </button>
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Предыдущее фото"
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
                    }}
                  >
                    <FiChevronLeft size={28} />
                  </button>
                  <button
                    type="button"
                    aria-label="Следующее фото"
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((lightboxIndex + 1) % photos.length);
                    }}
                  >
                    <FiChevronRight size={28} />
                  </button>
                </>
              )}
              <motion.img
                key={lightboxIndex}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.15 }}
                src={toImageUrl(photos[lightboxIndex].url)}
                alt="Фото"
                className="max-w-full max-h-[calc(100vh-2rem)] w-auto h-auto object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
