'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { SecretRoomPhoto } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiTrash2, FiLock, FiUpload } from 'react-icons/fi';

export default function AdminSecretRoomPage() {
  const [photos, setPhotos] = useState<SecretRoomPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const toImageUrl = (url: string) =>
    url.startsWith('/uploads/') ? url.replace('/uploads/', '/api/uploads/') : url;

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/secret-room');
      const data = await res.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching secret room photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const form = new FormData();
      for (let i = 0; i < files.length; i++) form.append('files', files[i]);
      const res = await fetch('/api/secret-room', { method: 'POST', body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Ошибка загрузки');
        return;
      }
      const data = await res.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить это фото?')) return;
    try {
      await fetch(`/api/secret-room?id=${id}`, { method: 'DELETE' });
      fetchPhotos();
    } catch (err) {
      console.error(err);
      alert('Ошибка удаления');
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center shadow-md">
                <FiLock className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold text-gray-800">
                  Секретная комната
                </h1>
                <p className="text-gray-600 mt-1">
                  Фотографии — только загрузка с устройства
                </p>
              </div>
            </div>
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
              className="btn-primary flex items-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
            >
              <FiUpload size={20} />
              {uploading ? 'Загрузка...' : 'Выбрать фото'}
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Выбери несколько фото с устройства — они появятся в секретной комнате. Заголовки и ссылки не нужны.
          </p>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto" />
            </div>
          ) : photos.length === 0 ? (
            <div className="card text-center py-16 text-gray-500">
              <FiUpload className="mx-auto mb-4 text-4xl text-gray-300" />
              <p>Пока нет фото. Нажми «Выбрать фото» и загрузи с устройства.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group aspect-square rounded-xl overflow-hidden shadow-md"
                >
                  <img
                    src={toImageUrl(photo.url)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete(photo.id)}
                    className="absolute top-2 right-2 w-9 h-9 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    aria-label="Удалить"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
