'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pun } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiMessageCircle } from 'react-icons/fi';

export default function AdminPunsPage() {
  const [puns, setPuns] = useState<Pun[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Pun | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ text: '', category: '' });

  const fetchPuns = async () => {
    try {
      const res = await fetch('/api/puns');
      const data = await res.json();
      setPuns(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuns();
  }, []);

  const handleCreate = async () => {
    if (!form.text.trim()) {
      alert('Введи текст каламбура');
      return;
    }
    try {
      await fetch('/api/puns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: form.text.trim(), category: form.category || undefined }),
      });
      setIsCreating(false);
      setForm({ text: '', category: '' });
      fetchPuns();
    } catch (e) {
      alert('Ошибка при создании');
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    try {
      await fetch('/api/puns', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, text: form.text.trim(), category: form.category || undefined, updatedAt: new Date().toISOString() }),
      });
      setEditing(null);
      setForm({ text: '', category: '' });
      fetchPuns();
    } catch (e) {
      alert('Ошибка при обновлении');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот каламбур?')) return;
    try {
      await fetch(`/api/puns?id=${id}`, { method: 'DELETE' });
      fetchPuns();
    } catch (e) {
      alert('Ошибка при удалении');
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-pastel-pink-700">Каламбуры</h1>
            <button
              type="button"
              onClick={() => {
                setIsCreating(true);
                setEditing(null);
                setForm({ text: '', category: '' });
              }}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus /> Добавить каламбур
            </button>
          </div>

          {(isCreating || editing) && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card mb-8">
              <h2 className="text-xl font-semibold text-pastel-pink-700 mb-4">
                {isCreating ? 'Новый каламбур' : 'Редактировать'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Текст</label>
                  <textarea
                    value={form.text}
                    onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                    className="input min-h-[100px] resize-y"
                    placeholder="Текст шутки / каламбура"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Категория (необязательно)</label>
                  <input
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="input"
                    placeholder="Например: игра слов"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={isCreating ? handleCreate : handleUpdate} className="btn-primary flex items-center gap-2">
                    <FiSave /> Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditing(null);
                      setForm({ text: '', category: '' });
                    }}
                    className="px-6 py-3 bg-pastel-blue-200 text-gray-700 rounded-xl font-medium hover:bg-pastel-blue-300 flex items-center gap-2"
                  >
                    <FiX /> Отмена
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-pastel-blue-200 border-t-pastel-pink-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {puns.map(p => (
                <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card flex justify-between items-start gap-4">
                  <div>
                    <p className="text-pastel-pink-700">&quot;{p.text}&quot;</p>
                    {p.category && (
                      <span className="text-sm text-gray-500 mt-1 inline-block">{p.category}</span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(p);
                        setForm({ text: p.text, category: p.category || '' });
                        setIsCreating(false);
                      }}
                      className="p-2 text-pastel-pink-600 hover:bg-pastel-pink-50 rounded-lg"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </motion.div>
              ))}
              {puns.length === 0 && (
                <div className="card text-center py-12">
                  <FiMessageCircle className="text-gray-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-600">Нет каламбуров. Добавь первый.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
