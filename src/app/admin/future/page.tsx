'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FutureDream } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiStar } from 'react-icons/fi';

const categories = [
  { id: 'dreams', label: 'Мечты', color: 'from-yellow-400 to-yellow-500' },
  { id: 'plans', label: 'Планы', color: 'from-blue-400 to-blue-500' },
  { id: 'goals', label: 'Цели', color: 'from-green-400 to-green-500' },
  { id: 'together', label: 'Вместе', color: 'from-pink-400 to-pink-500' },
];

export default function AdminFuturePage() {
  const [dreams, setDreams] = useState<FutureDream[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDream, setEditingDream] = useState<FutureDream | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'dreams' as FutureDream['category'],
    imageUrl: '',
    order: 0,
  });

  useEffect(() => {
    fetchDreams();
  }, []);

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

  const handleCreate = async () => {
    if (!formData.title || !formData.description) {
      alert('Пожалуйста, заполни заголовок и описание');
      return;
    }

    try {
      await addDoc(collection(db, 'future'), {
        ...formData,
        order: parseInt(formData.order.toString()),
        createdAt: Timestamp.now(),
      });
      setIsCreating(false);
      setFormData({ title: '', description: '', category: 'dreams', imageUrl: '', order: 0 });
      fetchDreams();
    } catch (error) {
      console.error('Error creating future dream:', error);
      alert('Ошибка при создании мечты');
    }
  };

  const handleUpdate = async () => {
    if (!editingDream || !formData.title || !formData.description) {
      alert('Пожалуйста, заполни все поля');
      return;
    }

    try {
      await updateDoc(doc(db, 'future', editingDream.id), {
        ...formData,
        order: parseInt(formData.order.toString()),
        updatedAt: Timestamp.now(),
      });
      setEditingDream(null);
      setFormData({ title: '', description: '', category: 'dreams', imageUrl: '', order: 0 });
      fetchDreams();
    } catch (error) {
      console.error('Error updating future dream:', error);
      alert('Ошибка при обновлении мечты');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ты уверена, что хочешь удалить эту мечту?')) return;

    try {
      await deleteDoc(doc(db, 'future', id));
      fetchDreams();
    } catch (error) {
      console.error('Error deleting future dream:', error);
      alert('Ошибка при удалении мечты');
    }
  };

  const startEdit = (dream: FutureDream) => {
    setEditingDream(dream);
    setFormData({
      title: dream.title,
      description: dream.description,
      category: dream.category,
      imageUrl: dream.imageUrl || '',
      order: dream.order,
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingDream(null);
    setIsCreating(false);
    setFormData({ title: '', description: '', category: 'dreams', imageUrl: '', order: 0 });
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'from-gray-400 to-gray-500';
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-indigo-700 mb-2">
                Наше будущее
              </h1>
              <p className="text-gray-600">
                Мечты, планы и цели, которые мы хотим осуществить вместе
              </p>
            </div>
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingDream(null);
                setFormData({ title: '', description: '', category: 'dreams', imageUrl: '', order: 0 });
              }}
              className="romantic-button flex items-center gap-2 bg-gradient-to-r from-indigo-400 to-indigo-500"
            >
              <FiPlus /> Новая мечта
            </button>
          </div>

          {/* Form */}
          {(isCreating || editingDream) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="romantic-card mb-8"
            >
              <h2 className="text-2xl font-display font-semibold text-gray-800 mb-4">
                {isCreating ? 'Создать мечту' : 'Редактировать мечту'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as FutureDream['category'] })
                    }
                    className="romantic-input"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
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
                    placeholder="Например: Поездка в Париж"
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
                    placeholder="Расскажи подробнее о нашей мечте..."
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
                    placeholder="https://example.com/dream.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Порядковый номер
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) })
                    }
                    className="romantic-input"
                    placeholder="1, 2, 3..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={editingDream ? handleUpdate : handleCreate}
                    className="romantic-button flex items-center gap-2 bg-gradient-to-r from-indigo-400 to-indigo-500"
                  >
                    <FiSave /> Сохранить мечту
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

          {/* Dreams List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dreams.map((dream, index) => (
                <motion.div
                  key={dream.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="romantic-card group hover:shadow-xl transition-all"
                >
                  <div className="relative">
                    {dream.imageUrl && (
                      <img
                        src={dream.imageUrl}
                        alt={dream.title}
                        className="w-full h-48 object-cover rounded-t-2xl"
                      />
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => startEdit(dream)}
                        className="p-2 bg-white/90 text-blue-600 rounded-lg hover:bg-white transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(dream.id)}
                        className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-white transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FiStar className="text-indigo-500" />
                      <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(dream.category)} text-white rounded-full text-sm font-medium`}>
                        {categories.find(c => c.id === dream.category)?.label}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        #{dream.order}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-semibold text-gray-800 mb-2">
                      {dream.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {dream.description}
                    </p>
                  </div>
                </motion.div>
              ))}

              {dreams.length === 0 && (
                <div className="romantic-card text-center py-12 col-span-full">
                  <FiStar className="text-indigo-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-600">
                    Пока нет мечт. Создай первую мечту о нашем будущем!
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