'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getRituals, addRitual, updateRitual, deleteRitual } from '@/lib/data';
import { Ritual } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiSmile } from 'react-icons/fi';

const ritualTypes = [
  { id: 'joke', label: 'Прикол', color: 'from-yellow-400 to-yellow-500' },
  { id: 'phrase', label: 'Фраза', color: 'from-blue-400 to-blue-500' },
  { id: 'tradition', label: 'Традиция', color: 'from-green-400 to-green-500' },
];

export default function AdminRitualsPage() {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRitual, setEditingRitual] = useState<Ritual | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'joke' as Ritual['type'],
  });

  useEffect(() => {
    fetchRituals();
  }, []);

  const fetchRituals = async () => {
    try {
      const response = await fetch('/api/rituals');
      const ritualsData = await response.json();
      setRituals(ritualsData);
    } catch (error) {
      console.error('Error fetching rituals:', error);
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
      const response = await fetch('/api/rituals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
        }),
      });

      if (response.ok) {
        setIsCreating(false);
        setFormData({ title: '', description: '', type: 'joke' });
        fetchRituals();
      } else {
        alert('Ошибка при создании прикола');
      }
    } catch (error) {
      console.error('Error creating ritual:', error);
      alert('Ошибка при создании прикола');
    }
  };

  const handleUpdate = async () => {
    if (!editingRitual || !formData.title || !formData.description) {
      alert('Пожалуйста, заполни все поля');
      return;
    }

    try {
      const response = await fetch('/api/rituals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingRitual.id,
          title: formData.title,
          description: formData.description,
          type: formData.type,
        }),
      });

      if (response.ok) {
        setEditingRitual(null);
        setFormData({ title: '', description: '', type: 'joke' });
        fetchRituals();
      } else {
        alert('Ошибка при обновлении прикола');
      }
    } catch (error) {
      console.error('Error updating ritual:', error);
      alert('Ошибка при обновлении прикола');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ты уверена, что хочешь удалить этот прикол?')) return;

    try {
      const response = await fetch(`/api/rituals?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchRituals();
      } else {
        alert('Ошибка при удалении прикола');
      }
    } catch (error) {
      console.error('Error deleting ritual:', error);
      alert('Ошибка при удалении прикола');
    }
  };

  const startEdit = (ritual: Ritual) => {
    setEditingRitual(ritual);
    setFormData({
      title: ritual.title,
      description: ritual.description,
      type: ritual.type,
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingRitual(null);
    setIsCreating(false);
    setFormData({ title: '', description: '', type: 'joke' });
  };

  const getTypeColor = (type: string) => {
    const typeItem = ritualTypes.find(t => t.id === type);
    return typeItem ? typeItem.color : 'from-gray-400 to-gray-500';
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-green-700 mb-2">
                Наши приколы
              </h1>
              <p className="text-gray-600">
                Наши забавные традиции, фразы и приколы
              </p>
            </div>
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingRitual(null);
                setFormData({ title: '', description: '', type: 'joke' });
              }}
              className="romantic-button flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-500"
            >
              <FiPlus /> Новый прикол
            </button>
          </div>

          {/* Form */}
          {(isCreating || editingRitual) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="romantic-card mb-8"
            >
              <h2 className="text-2xl font-display font-semibold text-gray-800 mb-4">
                {isCreating ? 'Создать прикол' : 'Редактировать прикол'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as Ritual['type'] })
                    }
                    className="romantic-input"
                  >
                    {ritualTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="romantic-input"
                    placeholder="Например: Наше особое приветствие"
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
                    placeholder="Расскажи, как это работает и почему это смешно..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={editingRitual ? handleUpdate : handleCreate}
                    className="romantic-button flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-500"
                  >
                    <FiSave /> Сохранить прикол
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

          {/* Rituals List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rituals.map((ritual, index) => (
                <motion.div
                  key={ritual.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="romantic-card group hover:shadow-xl transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FiSmile className="text-green-500" />
                      <span className={`px-3 py-1 bg-gradient-to-r ${getTypeColor(ritual.type)} text-white rounded-full text-sm font-medium`}>
                        {ritualTypes.find(t => t.id === ritual.type)?.label}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-semibold text-gray-800 mb-2">
                      {ritual.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-4">
                      {ritual.description}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => startEdit(ritual)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(ritual.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {rituals.length === 0 && (
                <div className="romantic-card text-center py-12 col-span-full">
                  <FiSmile className="text-green-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-600">
                    Пока нет приколов. Создай первый забавный прикол из нашей жизни!
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