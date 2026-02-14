'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Feeling } from '@/types';
import { FiBookOpen, FiAlertCircle } from 'react-icons/fi';

export default function MyFeelingsPage() {
  const [feelings, setFeelings] = useState<Feeling[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeelings = async () => {
      try {
        const response = await fetch('/api/feelings');
        const feelingsData = await response.json();
        setFeelings(feelingsData);
      } catch (error) {
        console.error('Error fetching feelings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeelings();
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-purple-700 mb-2">
              Мои чувства
            </h1>
            <p className="text-gray-600">
              Записи о моих эмоциях и переживаниях
            </p>
          </div>
          <div className="hidden md:block">
            <FiBookOpen className="text-purple-400 text-6xl opacity-20" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : feelings.length > 0 ? (
          <div className="space-y-6">
            {feelings.map((feeling, index) => (
              <motion.div
                key={feeling.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="romantic-card"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                      <FiBookOpen className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-semibold text-gray-800">
                        {feeling.title}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {feeling.emotionType}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {feeling.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="romantic-card text-center py-12">
            <FiAlertCircle className="text-purple-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-display font-semibold text-purple-700 mb-2">
              Пока нет записей
            </h2>
            <p className="text-gray-600 mb-6">
              Здесь будут храниться мои записи о чувствах и эмоциях
            </p>
            <div className="bg-purple-50 rounded-2xl p-4">
              <p className="text-sm text-purple-600 italic">
                "Эмоции - это цвета нашей души, а слова - кисти, которыми мы их рисуем"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}