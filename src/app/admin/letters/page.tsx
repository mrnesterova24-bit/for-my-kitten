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
import { Letter } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';

const categories = [
  { id: 'sad', label: 'Когда тебе грустно' },
  { id: 'doubt', label: 'Когда ты сомневаешься в себе' },
  { id: 'distance', label: 'Когда мы далеко друг от друга' },
  { id: 'argument', label: 'Когда мы ссоримся' },
  { id: 'happy', label: 'Когда ты счастлив' },
];

export default function AdminLettersPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    category: 'sad' as Letter['category'],
    title: '',
    content: '',
  });

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const q = query(collection(db, 'letters'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const lettersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Letter[];
      setLetters(lettersData);
    } catch (error) {
      console.error('Error fetching letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.content) {
      alert('Пожалуйста, заполни все поля');
      return;
    }

    try {
      await addDoc(collection(db, 'letters'), {
        ...formData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      setIsCreating(false);
      setFormData({ category: 'sad', title: '', content: '' });
      fetchLetters();
    } catch (error) {
      console.error('Error creating letter:', error);
      alert('Ошибка при создании письма');
    }
  };

  const handleUpdate = async () => {
    if (!editingLetter || !formData.title || !formData.content) {
      alert('Пожалуйста, заполни все поля');
      return;
    }

    try {
      await updateDoc(doc(db, 'letters', editingLetter.id), {
        ...formData,
        updatedAt: Timestamp.now(),
      });
      setEditingLetter(null);
      setFormData({ category: 'sad', title: '', content: '' });
      fetchLetters();
    } catch (error) {
      console.error('Error updating letter:', error);
      alert('Ошибка при обновлении письма');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ты уверена, что хочешь удалить это письмо?')) return;

    try {
      await deleteDoc(doc(db, 'letters', id));
      fetchLetters();
    } catch (error) {
      console.error('Error deleting letter:', error);
      alert('Ошибка при удалении письма');
    }
  };

  const startEdit = (letter: Letter) => {
    setEditingLetter(letter);
    setFormData({
      category: letter.category,
      title: letter.title,
      content: letter.content,
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingLetter(null);
    setIsCreating(false);
    setFormData({ category: 'sad', title: '', content: '' });
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-purple-700 mb-2">
                Manage Letters
              </h1>
              <p className="text-gray-600">
                Create and edit letters for different moments
              </p>
            </div>
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingLetter(null);
                setFormData({ category: 'sad', title: '', content: '' });
              }}
              className="romantic-button flex items-center gap-2"
            >
              <FiPlus /> New Letter
            </button>
          </div>

          {/* Form */}
          {(isCreating || editingLetter) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="romantic-card mb-8"
            >
              <h2 className="text-2xl font-display font-semibold text-gray-800 mb-4">
                {isCreating ? 'Create New Letter' : 'Edit Letter'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as Letter['category'] })
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
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="romantic-input"
                    placeholder="Letter title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="romantic-input min-h-[300px] resize-y"
                    placeholder="Write your letter here..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={editingLetter ? handleUpdate : handleCreate}
                    className="romantic-button flex items-center gap-2"
                  >
                    <FiSave /> Save Letter
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <FiX /> Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Letters List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {letters.map((letter) => (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="romantic-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {categories.find((c) => c.id === letter.category)?.label}
                        </span>
                      </div>
                      <h3 className="text-2xl font-display font-semibold text-gray-800 mb-2">
                        {letter.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">
                        {letter.content}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(letter)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(letter.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {letters.length === 0 && (
                <div className="romantic-card text-center py-12">
                  <p className="text-gray-600">
                    No letters yet. Create your first one!
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
