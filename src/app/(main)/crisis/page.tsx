'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CrisisSupport } from '@/types';
import { FiHeart, FiArrowLeft } from 'react-icons/fi';

export default function CrisisSupportPage() {
  const [messages, setMessages] = useState<CrisisSupport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<CrisisSupport | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/crisis');
        const messagesData = await response.json();
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching crisis messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'from-blue-400 to-blue-500';
      case 'moderate':
        return 'from-yellow-400 to-yellow-500';
      case 'severe':
        return 'from-red-400 to-red-500';
      default:
        return 'from-gray-400 to-gray-500';
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
          <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiHeart className="text-white text-4xl animate-pulse-soft" />
          </div>
          <h1 className="section-title">Я здесь для тебя</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Когда становится трудно, помни — ты не один. 
            Я всегда здесь, и эти слова написаны с любовью и заботой.
          </p>
        </motion.div>

        {/* Messages List or Detail */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
          </div>
        ) : selectedMessage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={() => setSelectedMessage(null)}
              className="mb-6 flex items-center gap-3 text-rose-600 hover:text-rose-700 transition-colors group"
            >
              <FiArrowLeft className="text-rose-500 group-hover:-translate-x-1 transition-transform" />
              <span>Назад ко всем сообщениям</span>
            </button>
            <div className="romantic-card">
              <h2 className="text-3xl font-display font-bold text-rose-700 mb-6">
                {selectedMessage.title}
              </h2>
              <div className="prose-romantic">
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedMessage.content.replace(/\n/g, '<br />'),
                  }}
                />
              </div>
              <div className="mt-8 pt-6 border-t border-rose-100 text-center">
                <FiHeart className="text-rose-400 text-3xl mx-auto mb-3" />
                <p className="text-gray-600 italic">
                  Ты любим. Ты важен. Ты имеешь значение.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.button
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedMessage(message)}
                className="w-full romantic-card text-left group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${getSeverityColor(
                      message.severity
                    )} rounded-2xl flex items-center justify-center shadow-md flex-shrink-0`}
                  >
                    <FiHeart className="text-white text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-semibold text-rose-700 group-hover:text-rose-800 transition-colors">
                      {message.title}
                    </h3>
                  </div>
                  <div className="text-rose-400 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </motion.button>
            ))}

            {messages.length === 0 && (
              <div className="romantic-card text-center py-12">
                <FiHeart className="text-rose-300 text-5xl mx-auto mb-4" />
                <p className="text-gray-600">
                  Сообщения поддержки готовятся с заботой... 💕
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Support Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 romantic-card bg-gradient-to-br from-rose-50 to-peach-50 text-center"
        >
          <FiHeart className="text-rose-400 text-4xl mx-auto mb-4 animate-pulse-soft" />
          <p className="text-lg text-gray-700 leading-relaxed">
            Помни: Каждый шторм проходит. Каждая ночь заканчивается рассветом. 
            Ты сильнее, чем думаешь, и ты глубоко любим.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
