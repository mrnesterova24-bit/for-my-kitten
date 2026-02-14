'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FinalLetter } from '@/types';
import { FiFeather, FiHeart } from 'react-icons/fi';

export default function FinalLetterPage() {
  const [letter, setLetter] = useState<FinalLetter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const response = await fetch('/api/final-letter');
        const letterData = await response.json();
        if (letterData) {
          setLetter(letterData);
        }
      } catch (error) {
        console.error('Error fetching final letter:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <FiFeather className="text-white text-4xl" />
          </motion.div>
          <h1 className="section-title text-pastel-pink-700">Главное напутствие</h1>
          <p className="text-xl text-gray-600 italic">
            Самые важные слова, написанные от моего сердца к твоему
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : letter ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="romantic-card bg-gradient-to-br from-amber-50 via-cream-50 to-peach-50 border-2 border-amber-200 shadow-2xl"
          >
            {/* Letter Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-amber-200">
              <p className="text-gray-500 italic mb-2">Моему дорогому Котёнку,</p>
              <div className="flex justify-center gap-2">
                <FiHeart className="text-rose-400 animate-pulse-soft" />
                <FiHeart className="text-rose-400 animate-pulse-soft animation-delay-200" />
                <FiHeart className="text-rose-400 animate-pulse-soft animation-delay-400" />
              </div>
            </div>

            {/* Letter Content */}
            <div className="prose-romantic text-lg leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html: letter.content.replace(/\n\n/g, '</p><p class="mt-4">').replace(/\n/g, '<br />'),
                }}
              />
            </div>

            {/* Letter Footer */}
            <div className="mt-12 pt-6 border-t-2 border-amber-200 text-center">
              <p className="text-gray-600 mb-3 italic text-lg">
                Со всей любовью в моем сердце,
              </p>
              <p className="text-2xl font-script text-rose-600 mb-4">
                Навсегда твой котёнок ♥
              </p>
              <div className="flex justify-center gap-2">
                <span className="text-3xl animate-float">💕</span>
                <span className="text-3xl animate-float animation-delay-200">✨</span>
                <span className="text-3xl animate-float animation-delay-400">💕</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="romantic-card text-center py-16"
          >
            <FiFeather className="text-amber-300 text-6xl mx-auto mb-6" />
            <p className="text-xl text-gray-600 mb-4">
              Письмо пишется с любовью и заботой...
            </p>
            <p className="text-gray-500 italic">
              Скоро вернись, чтобы прочитать его
            </p>
          </motion.div>
        )}

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-sm italic">
            Это письмо содержит суть всего, что я чувствую к тебе
          </p>
        </motion.div>
      </div>
    </div>
  );
}
