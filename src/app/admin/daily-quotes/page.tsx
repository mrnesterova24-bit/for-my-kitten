'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DailyQuote } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiSun } from 'react-icons/fi';

export default function AdminDailyQuotesPage() {
  const [quotes, setQuotes] = useState<DailyQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuote, setEditingQuote] = useState<DailyQuote | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
  });

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/daily-quotes');
      const quotesData = await response.json();
      setQuotes(quotesData);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.quote) {
      alert('Пожалуйста, введите цитату');
      return;
    }

    try {
      const response = await fetch('/api/daily-quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quote: formData.quote,
          author: formData.author,
        }),
      });

      if (response.ok) {
        setIsCreating(false);
        setFormData({ quote: '', author: '' });
        fetchQuotes();
      } else {
        alert('Ошибка при создании цитаты');
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      alert('Ошибка при создании цитаты');
    }
  };

  const handleUpdate = async () => {
    if (!editingQuote || !formData.quote) {
      alert('Пожалуйста, заполните цитату');
      return;
    }

    try {
      const response = await fetch('/api/daily-quotes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingQuote.id,
          quote: formData.quote,
          author: formData.author,
        }),
      });

      if (response.ok) {
        setEditingQuote(null);
        setFormData({ quote: '', author: '' });
        fetchQuotes();
      } else {
        alert('Ошибка при обновлении цитаты');
      }
    } catch (error) {
      console.error('Error updating quote:', error);
      alert('Ошибка при обновлении цитаты');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ты уверена, что хочешь удалить эту цитату?')) return;

    try {
      const response = await fetch(`/api/daily-quotes?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchQuotes();
      } else {
        alert('Ошибка при удалении цитаты');
      }
    } catch (error) {
      console.error('Error deleting quote:', error);
      alert('Ошибка при удалении цитаты');
    }
  };

  const handleToggleActive = async (quote: DailyQuote) => {
    try {
      const response = await fetch('/api/daily-quotes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: quote.id,
          isActive: !quote.isActive,
        }),
      });

      if (response.ok) {
        fetchQuotes();
      } else {
        alert('Ошибка при изменении статуса цитаты');
      }
    } catch (error) {
      console.error('Error toggling quote:', error);
      alert('Ошибка при изменении статуса цитаты');
    }
  };

  const startEdit = (quote: DailyQuote) => {
    setEditingQuote(quote);
    setFormData({
      quote: quote.quote,
      author: quote.author || '',
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingQuote(null);
    setIsCreating(false);
    setFormData({ quote: '', author: '' });
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-yellow-700 mb-2">
                Цитаты дня
              </h1>
              <p className="text-gray-600">
                Управляй ежедневными вдохновляющими цитатами
              </p>
            </div>
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingQuote(null);
                setFormData({ quote: '', author: '' });
              }}
              className="romantic-button flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500"
            >
              <FiPlus /> Новая цитата
            </button>
          </div>

          {/* Form */}
          {(isCreating || editingQuote) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="romantic-card mb-8"
            >
              <h2 className="text-2xl font-display font-semibold text-gray-800 mb-4">
                {isCreating ? 'Создать цитату' : 'Редактировать цитату'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цитата
                  </label>
                  <textarea
                    value={formData.quote}
                    onChange={(e) =>
                      setFormData({ ...formData, quote: e.target.value })
                    }
                    className="romantic-input min-h-[120px] resize-y"
                    placeholder="Впиши вдохновляющую цитату..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Автор (необязательно)
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className="romantic-input"
                    placeholder="Кто сказал эти слова?"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={editingQuote ? handleUpdate : handleCreate}
                    className="romantic-button flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500"
                  >
                    <FiSave /> Сохранить цитату
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <FiX /> Отмена
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quotes List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="romantic-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FiSun className="text-yellow-500" />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          quote.isActive 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {quote.isActive ? 'Активна' : 'Неактивна'}
                        </span>
                      </div>
                      <blockquote className="text-lg text-gray-800 mb-2">
                        "{quote.quote}"
                      </blockquote>
                      {quote.author && (
                        <p className="text-gray-600 text-sm">
                          — {quote.author}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleToggleActive(quote)}
                        className={`p-2 rounded-lg transition-colors ${
                          quote.isActive 
                            ? 'text-yellow-600 hover:bg-yellow-50' 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {quote.isActive ? 'Скрыть' : 'Показать'}
                      </button>
                      <button
                        onClick={() => startEdit(quote)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(quote.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {quotes.length === 0 && (
                <div className="romantic-card text-center py-12">
                  <FiSun className="text-yellow-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-600">
                    Пока нет цитат. Создай первую вдохновляющую цитату!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}