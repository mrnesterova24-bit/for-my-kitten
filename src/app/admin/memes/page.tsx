'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Meme } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiUpload, FiLink, FiTrash2, FiEdit2, FiSave, FiX, FiImage } from 'react-icons/fi';

export default function AdminMemesPage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Meme | null>(null);
  const [reelForm, setReelForm] = useState({ url: '', title: '' });
  const [showReelForm, setShowReelForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTitle, setUploadTitle] = useState('');

  const fetchMemes = async () => {
    try {
      const res = await fetch('/api/memes');
      const data = await res.json();
      setMemes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const form = new FormData();
      for (let i = 0; i < files.length; i++) form.append('files', files[i]);
      if (uploadTitle.trim()) form.set('title', uploadTitle.trim());
      const res = await fetch('/api/memes', { method: 'POST', body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Ошибка загрузки');
        return;
      }
      setUploadTitle('');
      fetchMemes();
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddReel = async () => {
    const url = reelForm.url.trim();
    if (!url) {
      alert('Введи ссылку на рилс');
      return;
    }
    try {
      await fetch('/api/memes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'reel', reelUrl: url, title: reelForm.title.trim() || undefined }),
      });
      setReelForm({ url: '', title: '' });
      setShowReelForm(false);
      fetchMemes();
    } catch (e) {
      alert('Ошибка при добавлении рилса');
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    try {
      await fetch('/api/memes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editing.id,
          type: editing.type,
          title: editing.title,
          caption: editing.type === 'image' ? editing.caption : undefined,
          imageUrl: editing.type === 'image' ? editing.imageUrl : undefined,
          reelUrl: editing.type === 'reel' ? editing.reelUrl : undefined,
          updatedAt: new Date().toISOString(),
        }),
      });
      setEditing(null);
      fetchMemes();
    } catch (e) {
      alert('Ошибка при сохранении');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить?')) return;
    try {
      await fetch(`/api/memes?id=${id}`, { method: 'DELETE' });
      fetchMemes();
      setEditing(null);
    } catch (e) {
      alert('Ошибка при удалении');
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-pastel-pink-700">Мемы</h1>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn-primary flex items-center gap-2"
              >
                <FiUpload size={18} />
                {uploading ? 'Загрузка...' : 'Фото с устройства'}
              </button>
              <button
                type="button"
                onClick={() => setShowReelForm(!showReelForm)}
                className="btn-primary flex items-center gap-2 bg-pastel-mint-500 hover:bg-pastel-mint-600"
              >
                <FiLink size={18} />
                Рилс из Instagram
              </button>
            </div>
          </div>

          {showReelForm && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="card mb-6">
              <h2 className="text-lg font-semibold text-pastel-pink-700 mb-3">Добавить рилс</h2>
              <div className="space-y-3">
                <input
                  value={reelForm.url}
                  onChange={e => setReelForm(f => ({ ...f, url: e.target.value }))}
                  className="input"
                  placeholder="Ссылка на рилс (Instagram)"
                />
                <input
                  value={reelForm.title}
                  onChange={e => setReelForm(f => ({ ...f, title: e.target.value }))}
                  className="input"
                  placeholder="Заголовок (необязательно)"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={handleAddReel} className="btn-primary flex items-center gap-2">
                    <FiSave /> Добавить
                  </button>
                  <button type="button" onClick={() => setShowReelForm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300">
                    <FiX />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Заголовок для загружаемых фото (необязательно)</label>
            <input
              value={uploadTitle}
              onChange={e => setUploadTitle(e.target.value)}
              className="input max-w-md"
              placeholder="Один заголовок на все выбранные фото"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-pastel-blue-200 border-t-pastel-pink-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {memes.map(m => (
                <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                  {editing?.id === m.id ? (
                    <div className="space-y-3">
                      <input
                        value={editing.title ?? ''}
                        onChange={e => setEditing({ ...editing, title: e.target.value })}
                        className="input"
                        placeholder="Заголовок"
                      />
                      {editing.type === 'image' && (
                        <input
                          value={editing.caption ?? ''}
                          onChange={e => setEditing({ ...editing, caption: e.target.value })}
                          className="input"
                          placeholder="Подпись"
                        />
                      )}
                      {editing.type === 'reel' && (
                        <input
                          value={editing.reelUrl ?? ''}
                          onChange={e => setEditing({ ...editing, reelUrl: e.target.value })}
                          className="input"
                          placeholder="Ссылка на рилс"
                        />
                      )}
                      <div className="flex gap-2">
                        <button type="button" onClick={handleUpdate} className="btn-primary flex items-center gap-1">
                          <FiSave /> Сохранить
                        </button>
                        <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">
                          <FiX />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {m.type === 'reel' ? (
                        <a
                          href={m.reelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-lg bg-gray-100 aspect-video flex items-center justify-center text-gray-500 hover:bg-gray-200"
                        >
                          <FiLink className="text-3xl" />
                        </a>
                      ) : (
                        <img
                          src={m.imageUrl}
                          alt={m.title || ''}
                          className="w-full aspect-video object-cover rounded-lg bg-pastel-blue-50"
                        />
                      )}
                      <div className="mt-4 flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-pastel-pink-700">{m.title || (m.type === 'reel' ? 'Рилс' : 'Мем')}</h3>
                          {m.type === 'image' && m.caption && <p className="text-sm text-gray-600">{m.caption}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditing(m)}
                            className="p-2 text-pastel-pink-600 hover:bg-pastel-pink-50 rounded-lg"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(m.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
              {memes.length === 0 && (
                <div className="col-span-2 card text-center py-12">
                  <FiImage className="text-gray-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-600">Нет мемов. Загрузи фото или добавь ссылку на рилс.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
