'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pun } from '@/types';
import { FiMessageCircle } from 'react-icons/fi';

export default function PunsPage() {
  const [puns, setPuns] = useState<Pun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPuns = async () => {
      try {
        const res = await fetch('/api/puns');
        const data = await res.json();
        setPuns(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching puns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPuns();
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-pastel-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiMessageCircle className="text-white text-4xl" />
          </div>
          <h1 className="section-title text-gray-700">Мои каламбуры</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Шутки и каламбуры, которые я для тебя припасла
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-pastel-pink-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {puns.map((pun, index) => (
              <motion.div
                key={pun.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card"
              >
                <p className="text-lg text-gray-700 leading-relaxed">&quot;{pun.text}&quot;</p>
                {pun.category && (
                  <span className="inline-block mt-2 text-sm text-gray-500 bg-pastel-pink-100 px-2 py-0.5 rounded">
                    {pun.category}
                  </span>
                )}
              </motion.div>
            ))}

            {puns.length === 0 && (
              <div className="card text-center py-12">
                <FiMessageCircle className="text-gray-300 text-5xl mx-auto mb-4" />
                <p className="text-gray-600">Пока нет каламбуров. Скоро появятся!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
