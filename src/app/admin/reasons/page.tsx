'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Reason } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiHeart } from 'react-icons/fi';

export default function AdminReasonsPage() {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReason, setEditingReason] = useState<Reason | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchReasons();
  }, []);

  const fetchReasons = async () => {
    try {
      const res = await fetch('/api/reasons');
      const data = await res.json();
      setReasons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reasons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.description) {
      alert('Пожалуйста, заполни заголовок и описание');
      return;
    }

    try {
      await fetch('/api/reasons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString(),
        }),
      });
      setIsCreating(false);
      setFormData({ title: '', description: '', imageUrl: '' });
      fetchReasons();
    } catch (error) {
      console.error('Error creating reason:', error);
      alert('Ошибка при создании причины');
    }
  };

  const handleUpdate = async () => {
    if (!editingReason || !formData.title || !formData.description) {
      alert('Пожалуйста, заполни все поля');
      return;
    }

    try {
      await fetch('/api/reasons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingReason.id,
          ...formData,
          updatedAt: new Date().toISOString(),
        }),
      });
      setEditingReason(null);
      setFormData({ title: '', description: '', imageUrl: '' });
      fetchReasons();
    } catch (error) {
      console.error('Error updating reason:', error);
      alert('Ошибка при обновлении причины');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ты уверена, что хочешь удалить эту причину?')) return;

    try {
      await fetch(`/api/reasons?id=${id}`, { method: 'DELETE' });
      fetchReasons();
    } catch (error) {
      console.error('Error deleting reason:', error);
      alert('Ошибка при удалении причины');
    }
  };

  const startEdit = (reason: Reason) => {
    setEditingReason(reason);
    setFormData({
      title: reason.title,
      description: reason.description,
      imageUrl: reason.imageUrl || '',
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingReason(null);
    setIsCreating(false);
    setFormData({ title: '', description: '', imageUrl: '' });
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-rose-700 mb-2">
                Почему ты самый лучший
              </h1>
              <p className="text-gray-600">
                Редактирование карточек с причинами
              </p>
            </div>
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingReason(null);
                setFormData({ title: '', description: '', imageUrl: '' });
              }}
              className="romantic-button flex items-center gap-2 bg-gradient-to-r from-rose-400 to-rose-500"
            >
              <FiPlus /> Новая причина
            </button>
          </div>

          {/* Form */}
          {(isCreating || editingReason) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="romantic-card mb-8"
            >
              <h2 className="text-2xl font-display font-semibold text-gray-800 mb-4">
                {isCreating ? 'Создать причину' : 'Редактировать причину'}
              </h2>

              <div className="space-y-4">
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
                    placeholder="Например: Ты делаешь меня счастливой"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="romantic-input min-h-[150px] resize-y"
                    placeholder="Расскажи подробнее, почему это важно..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ссылка на изображение (необязательно)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="romantic-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={editingReason ? handleUpdate : handleCreate}
                    className="romantic-button flex items-center gap-2 bg-gradient-to-r from-rose-400 to-rose-500"
                  >
                    <FiSave /> Сохранить причину
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

          {/* Reasons List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reasons.map((reason) => (
                <motion.div
                  key={reason.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="romantic-card group hover:shadow-xl transition-all"
                >
                  <div className="relative">
                    {reason.imageUrl && (
                      <img
                        src={reason.imageUrl}
                        alt={reason.title}
                        className="w-full h-48 object-cover rounded-t-2xl"
                      />
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => startEdit(reason)}
                        className="p-2 bg-white/90 text-blue-600 rounded-lg hover:bg-white transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(reason.id)}
                        className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-white transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FiHeart className="text-rose-500" />
                      <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
                        Причина
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-semibold text-gray-800 mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {reason.description}
                    </p>
                  </div>
                </motion.div>
              ))}

              {reasons.length === 0 && (
                <div className="romantic-card text-center py-12 col-span-full">
                  <FiHeart className="text-rose-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-600">
                    Пока нет причин. Создай первую карточку с причиной!
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