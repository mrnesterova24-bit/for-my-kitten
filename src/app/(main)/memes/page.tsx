'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Meme } from '@/types';
import { FiImage, FiLink } from 'react-icons/fi';

export default function MemesPage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const res = await fetch('/api/memes');
        const data = await res.json();
        setMemes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching memes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-pastel-mint-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiImage className="text-white text-4xl" />
          </div>
          <h1 className="section-title text-gray-700">Общие мемы</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Наши общие мемы и рилсы — чтобы улыбнуться
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-pastel-pink-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {memes.map((meme, index) => (
              <motion.article
                key={meme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card overflow-hidden"
              >
                {meme.type === 'reel' ? (
                  <a
                    href={meme.reelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-t-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    <FiLink className="text-5xl" />
                  </a>
                ) : (
                  <img
                    src={meme.imageUrl}
                    alt={meme.title || 'Мем'}
                    className="w-full aspect-video object-cover rounded-t-xl bg-gray-100"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-700 mb-1">{meme.title || (meme.type === 'reel' ? 'Рилс' : 'Мем')}</h3>
                  {meme.type === 'image' && meme.caption && (
                    <p className="text-sm text-gray-600">{meme.caption}</p>
                  )}
                  {meme.type === 'reel' && (
                    <p className="text-sm text-pastel-pink-600">Открыть в Instagram →</p>
                  )}
                </div>
              </motion.article>
            ))}

            {memes.length === 0 && (
              <div className="col-span-2 card text-center py-12">
                <FiImage className="text-gray-300 text-5xl mx-auto mb-4" />
                <p className="text-gray-600">Пока нет мемов. Скоро появятся!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
