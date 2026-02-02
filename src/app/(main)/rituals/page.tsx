'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Ritual } from '@/types';
import { FiSmile, FiMessageCircle, FiStar } from 'react-icons/fi';

const typeIcons = {
  joke: '😄',
  phrase: '💬',
  tradition: '✨',
};

const typeColors = {
  joke: 'from-yellow-400 to-yellow-500',
  phrase: 'from-pink-400 to-pink-500',
  tradition: 'from-purple-400 to-purple-500',
};

export default function RitualsPage() {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const fetchRituals = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'rituals'));
        const ritualsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Ritual[];
        setRituals(ritualsData);
      } catch (error) {
        console.error('Error fetching rituals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRituals();
  }, []);

  const filteredRituals = selectedType
    ? rituals.filter((r) => r.type === selectedType)
    : rituals;

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiSmile className="text-white text-4xl" />
          </div>
          <h1 className="section-title text-green-700">Наши ритуалы</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Особые моменты, внутренние шутки и традиции, которые делают нас уникально нами
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setSelectedType(null)}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              selectedType === null
                ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Все ритуалы
          </button>
          <button
            onClick={() => setSelectedType('joke')}
            className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
              selectedType === 'joke'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>😄</span> Наши шутки
          </button>
          <button
            onClick={() => setSelectedType('phrase')}
            className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
              selectedType === 'phrase'
                ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>💬</span> Наши фразы
          </button>
          <button
            onClick={() => setSelectedType('tradition')}
            className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
              selectedType === 'tradition'
                ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>✨</span> Наши традиции
          </button>
        </motion.div>

        {/* Rituals Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredRituals.length === 0 ? (
          <div className="romantic-card text-center py-12">
            <p className="text-gray-600 text-lg">
              {selectedType
                ? `Пока нет ${selectedType === 'joke' ? 'шуток' : selectedType === 'phrase' ? 'фраз' : 'традиций'}. Они будут добавлены, когда мы создадим больше воспоминаний! 💕`
                : 'Наши ритуалы документируются... Загляни скоро! ✨'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredRituals.map((ritual, index) => (
              <motion.div
                key={ritual.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="romantic-card group hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${
                      typeColors[ritual.type]
                    } rounded-2xl flex items-center justify-center shadow-md flex-shrink-0`}
                  >
                    <span className="text-3xl">{typeIcons[ritual.type]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium uppercase">
                        {ritual.type}
                      </span>
                    </div>
                    <h3 className="text-2xl font-display font-semibold text-gray-800 mb-3">
                      {ritual.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {ritual.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 romantic-card bg-gradient-to-br from-green-50 to-teal-50 text-center"
        >
          <FiStar className="text-green-400 text-4xl mx-auto mb-4 animate-pulse-soft" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Каждая внутренняя шутка, каждая особая фраза, каждая традиция, которую мы создаем вместе—
            это нити, которые плетут уникальный гобелен нашей истории любви.
          </p>
          <p className="text-gray-600 mt-4 italic">
            За то, чтобы всю жизнь создавать больше воспоминаний ♥
          </p>
        </motion.div>
      </div>
    </div>
  );
}
