'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiSave, FiFeather } from 'react-icons/fi';

export default function AdminFinalLetterPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    fetchLetter();
  }, []);

  const fetchLetter = async () => {
    try {
      const res = await fetch('/api/final-letter');
      const data = await res.json();
      if (data && data.content) {
        setContent(data.content);
        setExists(true);
      } else {
        setContent('');
        setExists(false);
      }
    } catch (error) {
      console.error('Error fetching final letter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Введите текст напутствия');
      return;
    }
    setSaving(true);
    try {
      const url = '/api/final-letter';
      const method = exists ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      });
      if (res.ok) {
        setExists(true);
        alert('Сохранено');
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Ошибка при сохранении');
      }
    } catch (error) {
      console.error('Error saving final letter:', error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-md">
                <FiFeather className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold text-amber-800">
                  Главное напутствие
                </h1>
                <p className="text-gray-600 mt-1">
                  Один текст — главное напутствие
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="card p-12 text-center">
              <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Загрузка...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текст напутствия (абзацы разделяй пустой строкой)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input min-h-[400px] font-serif text-lg"
                placeholder="Напиши главное напутствие..."
                spellCheck="true"
              />
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <FiSave size={20} />
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
