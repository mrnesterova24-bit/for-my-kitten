'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Letter } from '@/types';
import { FiChevronRight } from 'react-icons/fi';

const categories = [
  {
    id: 'sad',
    title: 'Когда тебе грустно',
    emoji: '😢',
    color: 'from-blue-400 to-blue-500',
    description: 'Для моментов, когда текут слезы',
  },
  {
    id: 'doubt',
    title: 'Когда ты сомневаешься в себе',
    emoji: '💪',
    color: 'from-purple-400 to-purple-500',
    description: 'Помни о своей невероятной силе',
  },
  {
    id: 'distance',
    title: 'Когда мы далеко друг от друга',
    emoji: '🌍',
    color: 'from-teal-400 to-teal-500',
    description: 'Расстояние ничего не значит для нас',
  },
  {
    id: 'argument',
    title: 'Когда мы ссоримся',
    emoji: '💔',
    color: 'from-rose-400 to-rose-500',
    description: 'Даже в конфликте моя любовь остается',
  },
  {
    id: 'happy',
    title: 'Когда ты счастлив',
    emoji: '🎉',
    color: 'from-yellow-400 to-yellow-500',
    description: 'Празднуем твою радость вместе',
  },
];

export default function LettersPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLetters = async (category: string) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'letters'),
        where('category', '==', category)
      );
      const snapshot = await getDocs(q);
      const lettersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Letter[];
      setLetters(lettersData);
    } catch (error) {
      console.error('Error fetching letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedLetter(null);
    fetchLetters(categoryId);
  };

  const handleBack = () => {
    if (selectedLetter) {
      setSelectedLetter(null);
    } else {
      setSelectedCategory(null);
      setLetters([]);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="section-title">Письма от меня</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Слова, написанные с любовью, ждущие моментов, когда они тебе нужны больше всего
          </p>
        </motion.div>

        {/* Back Button */}
        {(selectedCategory || selectedLetter) && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors"
          >
            <FiChevronRight className="rotate-180" />
            <span>Назад</span>
          </motion.button>
        )}

        {/* Category Selection */}
        {!selectedCategory && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleCategoryClick(category.id)}
                className="romantic-card text-left group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0`}
                  >
                    <span className="text-3xl">{category.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-semibold text-rose-700 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end text-rose-500 group-hover:translate-x-1 transition-transform">
                  <span className="text-sm mr-2">Открыть письма</span>
                  <FiChevronRight />
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Letters List */}
        {selectedCategory && !selectedLetter && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Загружаю письма...</p>
              </div>
            ) : letters.length === 0 ? (
              <div className="romantic-card text-center py-12">
                <p className="text-gray-600 text-lg">
                  Пока нет писем в этой категории. Загляни позже! 💌
                </p>
              </div>
            ) : (
              letters.map((letter, index) => (
                <motion.button
                  key={letter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedLetter(letter)}
                  className="w-full romantic-card text-left group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-display font-semibold text-rose-700">
                      {letter.title}
                    </h3>
                    <FiChevronRight className="text-rose-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              ))
            )}
          </div>
        )}

        {/* Letter Content */}
        {selectedLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="romantic-card max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-display font-bold text-rose-700 mb-6">
              {selectedLetter.title}
            </h2>
            <div className="prose-romantic">
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedLetter.content.replace(/\n/g, '<br />'),
                }}
              />
            </div>
            <div className="mt-8 pt-6 border-t border-rose-100 text-center">
              <p className="text-gray-500 italic">
                Со всей моей любовью, всегда ♥
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
