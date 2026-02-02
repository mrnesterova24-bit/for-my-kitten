'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ReasonCard } from '@/types';

export default function WhyYouMatterPage() {
  const [reasons, setReasons] = useState<ReasonCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const q = query(collection(db, 'reasons'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        const reasonsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ReasonCard[];
        setReasons(reasonsData);
      } catch (error) {
        console.error('Error fetching reasons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReasons();
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="section-title">Почему ты важен</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Вот лишь некоторые из бесконечных причин, почему ты незаменим
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="romantic-card"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center mb-4 shadow-md">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="text-2xl font-display font-semibold text-rose-700 mb-3">
                  {reason.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            ))}
            
            {reasons.length === 0 && (
              <div className="col-span-full romantic-card text-center py-12">
                <p className="text-gray-600">
                  Причины готовятся с любовью... 💕
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
