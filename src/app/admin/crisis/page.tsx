'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CrisisSupport } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiAlertCircle } from 'react-icons/fi';

const severityOptions = [
  { value: 'mild', label: 'Легкая', color: 'from-blue-400 to-blue-500' },
  { value: 'moderate', label: 'Средняя', color: 'from-yellow-400 to-yellow-500' },
  { value: 'severe', label: 'Серьезная', color: 'from-red-400 to-red-500' },
];

export default function AdminCrisisPage() {
  const [messages, setMessages] = useState<CrisisSupport[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState<CrisisSupport | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    severity: 'mild' as 'mild' | 'moderate' | 'severe',
    order: 0,
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/crisis');
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching crisis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Заполни заголовок и текст');
      return;
    }
    try {
      await fetch('/api/crisis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          severity: formData.severity,
          order: formData.order,
        }),
      });
      setIsCreating(false);
      setFormData({ title: '', content: '', severity: 'mild', order: messages.length });
      fetchMessages();
    } catch (error) {
      console.error('Error creating crisis message:', error);
      alert('Ошибка при создании');
    }
  };

  const handleUpdate = async () => {
    if (!editingMessage || !formData.title.trim() || !formData.content.trim()) {
      alert('Заполни все поля');
      return;
    }
    try {
      await fetch('/api/crisis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingMessage.id,
          title: formData.title.trim(),
          content: formData.content.trim(),
          severity: formData.severity,
          order: formData.order,
        }),
      });
      setEditingMessage(null);
      setFormData({ title: '', content: '', severity: 'mild', order: 0 });
      fetchMessages();
    } catch (error) {
      console.error('Error updating crisis message:', error);
      alert('Ошибка при обновлении');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить это сообщение?')) return;
    try {
      await fetch(`/api/crisis?id=${id}`, { method: 'DELETE' });
      fetchMessages();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Ошибка при удалении');
    }
  };

  const startEdit = (msg: CrisisSupport) => {
    setEditingMessage(msg);
    setFormData({
      title: msg.title,
      content: msg.content,
      severity: msg.severity,
      order: msg.order ?? 0,
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setIsCreating(false);
    setFormData({ title: '', content: '', severity: 'mild', order: 0 });
  };

  const getSeverityLabel = (s: string) => severityOptions.find(o => o.value === s)?.label ?? s;
  const getSeverityColor = (s: string) => severityOptions.find(o => o.value === s)?.color ?? 'from-gray-400 to-gray-500';

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-md">
                <FiAlertCircle className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold text-red-700">Если трудно</h1>
                <p className="text-gray-600 mt-1">Сообщения поддержки в кризис</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingMessage(null);
                setFormData({ title: '', content: '', severity: 'mild', order: messages.length });
              }}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus /> Добавить
            </button>
          </div>

          {(isCreating || editingMessage) && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {isCreating ? 'Новое сообщение' : 'Редактировать'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                    placeholder="Заголовок"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Текст</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="input min-h-[120px]"
                    placeholder="Текст поддержки"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Степень</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as 'mild' | 'moderate' | 'severe' })}
                    className="input"
                  >
                    {severityOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={editingMessage ? handleUpdate : handleCreate} className="btn-primary flex items-center gap-2">
                    <FiSave /> Сохранить
                  </button>
                  <button onClick={cancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 flex items-center gap-2">
                    <FiX /> Отмена
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block px-2 py-0.5 rounded text-sm text-white bg-gradient-to-r ${getSeverityColor(msg.severity)} mb-2`}>
                        {getSeverityLabel(msg.severity)}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{msg.title}</h3>
                      <p className="text-gray-600 text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => startEdit(msg)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" aria-label="Редактировать">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(msg.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" aria-label="Удалить">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {messages.length === 0 && !isCreating && (
                <div className="card text-center py-12 text-gray-600">Нет сообщений. Добавь первое.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
