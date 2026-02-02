'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TimelineEvent } from '@/types';
import { FiClock, FiAlertCircle } from 'react-icons/fi';

export default function OurStoryPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, 'timeline'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        const eventsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TimelineEvent[];
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching timeline events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-teal-700 mb-2">
              Наша история
            </h1>
            <p className="text-gray-600">
              Хронология важных событий в нашей жизни
            </p>
          </div>
          <div className="hidden md:block">
            <FiClock className="text-teal-400 text-6xl opacity-20" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="romantic-card"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
                        <FiClock className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-semibold text-gray-800">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {event.date}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                      #{event.order}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {event.description}
                  </p>
                  {event.imageUrl && (
                    <div className="mt-4">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="romantic-card text-center py-12">
            <FiClock className="text-teal-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-display font-semibold text-teal-700 mb-2">
              Пока нет событий
            </h2>
            <p className="text-gray-600 mb-6">
              Здесь будет храниться история наших важных моментов
            </p>
            <div className="bg-teal-50 rounded-2xl p-4">
              <p className="text-sm text-teal-600 italic">
                "Каждый момент с тобой - это страница нашей прекрасной истории"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}