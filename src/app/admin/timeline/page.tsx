'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TimelineEvent } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiClock } from 'react-icons/fi';

export default function AdminTimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
    imageUrl: '',
    order: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/timeline');
      const eventsData = await response.json();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.date || !formData.title || !formData.description) {
      alert('Пожалуйста, заполни дату, заголовок и описание');
      return;
    }

    try {
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order.toString()),
          createdAt: new Date().toISOString(),
        }),
      });
      const newEvent = await response.json();
      setIsCreating(false);
      setFormData({ date: '', title: '', description: '', imageUrl: '', order: 0 });
      fetchEvents();
    } catch (error) {
      console.error('Error creating timeline event:', error);
      alert('Ошибка при создании события');
    }
  };

  const handleUpdate = async () => {
    if (!editingEvent || !formData.date || !formData.title || !formData.description) {
      alert('Пожалуйста, заполни все поля');
      return;
    }

    try {
      const response = await fetch('/api/timeline', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingEvent.id,
          ...formData,
          order: parseInt(formData.order.toString()),
          updatedAt: new Date().toISOString(),
        }),
      });
      const updatedEvent = await response.json();
      setEditingEvent(null);
      setFormData({ date: '', title: '', description: '', imageUrl: '', order: 0 });
      fetchEvents();
    } catch (error) {
      console.error('Error updating timeline event:', error);
      alert('Ошибка при обновлении события');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ты уверена, что хочешь удалить это событие?')) return;

    try {
      await fetch(`/api/timeline?id=${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting timeline event:', error);
      alert('Ошибка при удалении события');
    }
  };

  const startEdit = (event: TimelineEvent) => {
    setEditingEvent(event);
    setFormData({
      date: event.date,
      title: event.title,
      description: event.description,
      imageUrl: event.imageUrl || '',
      order: event.order,
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setIsCreating(false);
    setFormData({ date: '', title: '', description: '', imageUrl: '', order: 0 });
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-teal-700 mb-2">
                Наша история
              </h1>
              <p className="text-gray-600">
                Хронология важных событий в нашей жизни
              </p>
            </div>
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingEvent(null);
                setFormData({ date: '', title: '', description: '', imageUrl: '', order: 0 });
              }}
              className="romantic-button flex items-center gap-2 bg-gradient-to-r from-teal-400 to-teal-500"
            >
              <FiPlus /> Новое событие
            </button>
          </div>

          {/* Form */}
          {(isCreating || editingEvent) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="romantic-card mb-8"
            >
              <h2 className="text-2xl font-display font-semibold text-gray-800 mb-4">
                {isCreating ? 'Создать событие' : 'Редактировать событие'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дата
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="romantic-input"
                  />
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
                    placeholder="Например: Наша первая встреча"
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
                    placeholder="Расскажи подробнее об этом дне..."
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
                    placeholder="https://example.com/photo.jpg"
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
                    onClick={editingEvent ? handleUpdate : handleCreate}
                    className="romantic-button flex items-center gap-2 bg-gradient-to-r from-teal-400 to-teal-500"
                  >
                    <FiSave /> Сохранить событие
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

          {/* Timeline Events List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="romantic-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FiClock className="text-teal-500" />
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                          {event.date}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          #{event.order}
                        </span>
                      </div>
                      <h3 className="text-2xl font-display font-semibold text-gray-800 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {event.description}
                      </p>
                      {event.imageUrl && (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {events.length === 0 && (
                <div className="romantic-card text-center py-12">
                  <FiClock className="text-teal-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-600">
                    Пока нет событий. Создай первое важное событие в нашей истории!
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