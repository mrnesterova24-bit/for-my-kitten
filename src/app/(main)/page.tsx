'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DailyQuote } from '@/types';
import { 
  FiHeart, 
  FiSun, 
  FiClock, 
  FiFeather, 
  FiBookOpen, 
  FiStar, 
  FiGift, 
  FiLock, 
  FiSmile, 
  FiMapPin 
} from 'react-icons/fi';

export default function HomePage() {
  const [quote, setQuote] = useState<DailyQuote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyQuote = async () => {
      try {
        const q = query(
          collection(db, 'dailyQuotes'),
          where('isActive', '==', true),
          limit(1)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setQuote({ id: doc.id, ...doc.data() } as DailyQuote);
        }
      } catch (error) {
        console.error('Error fetching daily quote:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyQuote();
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="inline-block"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 rounded-full flex items-center justify-center shadow-2xl mb-6 mx-auto">
              <FiHeart className="text-white text-5xl animate-pulse-soft" />
            </div>
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-display font-bold text-rose-700 mb-4">
            Ришат, я здесь
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-2xl md:text-3xl text-gray-700 font-light leading-relaxed max-w-3xl mx-auto"
          >
            Добро пожаловать в наше священное пространство. Когда ты нуждаешься во мне, я здесь—
            в каждом мгновении, в каждой эмоции, в каждом биении сердца.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-2 text-rose-500"
          >
            <FiHeart className="animate-float" />
            <FiHeart className="animate-float animation-delay-200" />
            <FiHeart className="animate-float animation-delay-400" />
          </motion.div>
        </motion.div>

        {/* Daily Quote/Message Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="romantic-card"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-peach-400 to-peach-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <FiSun className="text-white text-xl" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-display font-semibold text-rose-700 mb-3">
                Сообщение на сегодня
              </h2>
              
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-rose-100 rounded w-3/4"></div>
                  <div className="h-4 bg-rose-100 rounded w-1/2"></div>
                </div>
              ) : quote ? (
                <>
                  <p className="text-lg text-gray-700 leading-relaxed italic mb-2">
                    "{quote.quote}"
                  </p>
                  {quote.author && (
                    <p className="text-sm text-gray-500">
                      — {quote.author}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-lg text-gray-700 leading-relaxed italic">
                  "Ты любим безмерно, дорог невыразимо и нужен больше, чем можешь знать."
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Navigation Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <motion.a
            href="/letters"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="romantic-card group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-3xl">💌</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold text-rose-700 mb-1">
                  Письма от меня
                </h3>
                <p className="text-gray-600 text-sm">
                  Слова для каждого нужного момента
                </p>
              </div>
            </div>
          </motion.a>

          <motion.a
            href="/crisis"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="romantic-card group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-3xl">🤗</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold text-rose-700 mb-1">
                  Нужна поддержка?
                </h3>
                <p className="text-gray-600 text-sm">
                  Я здесь в трудные моменты
                </p>
              </div>
            </div>
          </motion.a>
        </motion.div>

        {/* All Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-4 gap-4"
        >
          <motion.a
            href="/why-you-matter"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="romantic-button flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-rose-400 to-rose-500 text-white font-medium"
          >
            <FiHeart />
            Почему ты важен
          </motion.a>

          <motion.a
            href="/my-feelings"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="romantic-button flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-purple-400 to-purple-500 text-white font-medium"
          >
            <FiBookOpen />
            Мои чувства
          </motion.a>

          <motion.a
            href="/our-story"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="romantic-button flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-medium"
          >
            <FiClock />
            Наша история
          </motion.a>

          <motion.a
            href="/our-future"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="romantic-button flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-indigo-400 to-indigo-500 text-white font-medium"
          >
            <FiStar />
            Наше будущее
          </motion.a>

          <motion.a
            href="/surprises"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="romantic-button flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-medium"
          >
            <FiGift />
            Сюрпризы
          </motion.a>

          <motion.a
            href="/secret-room"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="romantic-button flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium"
          >
            <FiLock />
            Секретная комната
          </motion.a>

          <motion.a
            href="/rituals"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="romantic-button flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-400 to-green-500 text-white font-medium"
          >
            <FiSmile />
            Наши приколы
          </motion.a>

          <motion.a
            href="/apart"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="romantic-button flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white font-medium"
          >
            <FiMapPin />
            Когда мы далеко
          </motion.a>

          <motion.a
            href="/final-letter"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="romantic-button flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-medium"
          >
            <FiFeather />
            Главное письмо
          </motion.a>
        </motion.div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center py-8"
        >
          <p className="text-gray-500 italic text-lg">
            Исследуй навигацию, чтобы открыть всю любовь, которая ждет тебя ♥
          </p>
        </motion.div>
      </div>
    </div>
  );
}
