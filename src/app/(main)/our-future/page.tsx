'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FutureDream } from '@/types';
import { FiStar, FiAlertCircle } from 'react-icons/fi';

export default function OurFuturePage() {
  const [dreams, setDreams] = useState<FutureDream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDreams = async () => {
      try {
        const q = query(collection(db, 'future'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        const dreamsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FutureDream[];
        setDreams(dreamsData);
      } catch (error) {
        console.error('Error fetching future dreams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDreams();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dreams': return 'from-yellow-400 to-yellow-500';
      case 'plans': return 'from-blue-400 to-blue-500';
      case 'goals': return 'from-green-400 to-green-500';
      case 'together': return 'from-pink-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-indigo-700 mb-2">
              Наше будущее
            </h1>
            <p className="text-gray-600">
              Мечты, планы и цели, которые мы хотим осуществить вместе
            </p>
          </div>
          <div className="hidden md:block">
            <FiStar className="text-indigo-400 text-6xl opacity-20" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : dreams.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {dreams.map((dream, index) => (
              <motion.div
                key={dream.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="romantic-card"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center">
                      <FiStar className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-semibold text-gray-800">
                        {dream.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor(dream.category)} text-white rounded-full text-xs font-medium`}>
                          {dream.category === 'dreams' ? 'Мечта' : 
                           dream.category === 'plans' ? 'План' : 
                           dream.category === 'goals' ? 'Цель' : 'Вместе'}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          #{dream.order}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {dream.description}
                  </p>
                  {dream.imageUrl && (
                    <div className="mt-4">
                      <img
                        src={dream.imageUrl}
                        alt={dream.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="romantic-card text-center py-12">
            <FiStar className="text-indigo-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-display font-semibold text-indigo-700 mb-2">
              Пока нет мечт
            </h2>
            <p className="text-gray-600 mb-6">
              Здесь будут храниться наши мечты и планы на будущее
            </p>
            <div className="bg-indigo-50 rounded-2xl p-4">
              <p className="text-sm text-indigo-600 italic">
                "Наше будущее - это история, которую мы пишем вместе, шаг за шагом"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}