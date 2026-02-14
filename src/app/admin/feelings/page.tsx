'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Feeling } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiBookOpen } from 'react-icons/fi';

const emotionTypes = [
  { id: 'happy', label: 'Счастье', color: 'from-green-400 to-green-500' },
  { id: 'sad', label: 'Грусть', color: 'from-blue-400 to-blue-500' },
  { id: 'angry', label: 'Злость', color: 'from-red-400 to-red-500' },
  { id: 'anxious', label: 'Тревога', color: 'from-purple-400 to-purple-500' },
  { id: 'loved', label: 'Любовь', color: 'from-pink-400 to-pink-500' },
  { id: 'proud', label: 'Гордость', color: 'from-yellow-400 to-yellow-500' },
];

export default function AdminFeelingsPage() {
  const [feelings, setFeelings] = useState<Feeling[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFeeling, setEditingFeeling] = useState<Feeling | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    emotionType: 'happy',
  });

  useEffect(() => {
    fetchFeelings();
  }, []);

  const fetchFeelings = async () => {
    try {
      const res = await fetch('/api/feelings');
      const data = await res.json();
      setFeelings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching feelings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.content) {
      alert('Пожалуйста, заполни заголовок и содержание');
      return;
    }

    try {
      await fetch('/api/feelings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      setIsCreating(false);
      setFormData({ title: '', content: '', emotionType: 'happy' });
      fetchFeelings();
    } catch (error) {
      console.error('Error creating feeling:', error);
      alert('Ошибка при создании записи');
    }
  };

  const handleUpdate = async () => {
    if (!editingFeeling || !formData.title || !formData.content) {
      alert('Пожалуйста, заполни все поля');
      return;
    }

    try {
      await fetch('/api/feelings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingFeeling.id,
          ...formData,
          updatedAt: new Date().toISOString(),
        }),
      });
      setEditingFeeling(null);
      setFormData({ title: '', content: '', emotionType: 'happy' });
      fetchFeelings();
    } catch (error) {
      console.error('Error updating feeling:', error);
      alert('Ошибка при обновлении записи');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ты уверена, что хочешь удалить эту запись?')) return;

    try {
      await fetch(`/api/feelings?id=${id}`, { method: 'DELETE' });
      fetchFeelings();
    } catch (error) {
      console.error('Error deleting feeling:', error);
      alert('Ошибка при удалении записи');
    }
  };

  const startEdit = (feeling: Feeling) => {
    setEditingFeeling(feeling);
    setFormData({
      title: feeling.title,
      content: feeling.content,
      emotionType: feeling.emotionType,
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingFeeling(null);
    setIsCreating(false);
    setFormData({ title: '', content: '', emotionType: 'happy' });
  };

  const getEmotionColor = (emotionType: string) => {
    const emotion = emotionTypes.find(e => e.id === emotionType);
    return emotion ? emotion.color : 'from-gray-400 to-gray-500';
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-purple-700 mb-2">
                Мои чувства
              </h1>
              <p className="text-gray-600">
                Записи о своих эмоциях и переживаниях
              </p>
            </div>
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingFeeling(null);
                setFormData({ title: '', content: '', emotionType: 'happy' });
              }}
              className="romantic-button flex items-center gap-2 bg-gradient-to-r from-purple-400 to-purple-500"
            >
              <FiPlus /> Новая запись
            </button>
          </div>

          {/* Form */}
          {(isCreating || editingFeeling) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="romantic-card mb-8"
            >
              <h2 className="text-2xl font-display font-semibold text-gray-800 mb-4">
                {isCreating ? 'Создать запись' : 'Редактировать запись'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Эмоция
                  </label>
                  <select
                    value={formData.emotionType}
                    onChange={(e) =>
                      setFormData({ ...formData, emotionType: e.target.value })
                    }
                    className="romantic-input"
                  >
                    {emotionTypes.map((emotion) => (
                      <option key={emotion.id} value={emotion.id}>
                        {emotion.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Заголовок
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="romantic-input"
                    placeholder="Как назовем эту запись?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Содержание
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="romantic-input min-h-[200px] resize-y"
                    placeholder="Расскажи о своих чувствах..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={editingFeeling ? handleUpdate : handleCreate}
                    className="romantic-button flex items-center gap-2 bg-gradient-to-r from-purple-400 to-purple-500"
                  >
                    <FiSave /> Сохранить запись
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

          {/* Feelings List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {feelings.map((feeling) => (
                <motion.div
                  key={feeling.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="romantic-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FiBookOpen className="text-purple-500" />
                        <span className={`px-3 py-1 bg-gradient-to-r ${getEmotionColor(feeling.emotionType)} text-white rounded-full text-sm font-medium`}>
                          {emotionTypes.find(e => e.id === feeling.emotionType)?.label}
                        </span>
                      </div>
                      <h3 className="text-2xl font-display font-semibold text-gray-800 mb-2">
                        {feeling.title}
                      </h3>
                      <p className="text-gray-600 whitespace-pre-wrap">
                        {feeling.content}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(feeling)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(feeling.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {feelings.length === 0 && (
                <div className="romantic-card text-center py-12">
                  <FiBookOpen className="text-purple-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-600">
                    Пока нет записей. Создай первую запись о своих чувствах!
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