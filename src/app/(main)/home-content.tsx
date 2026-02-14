'use client';

import { useEffect, useState } from 'react';
import { DailyQuote } from '@/types';
import {
  FiHeart,
  FiSun,
  FiFeather,
  FiBookOpen,
  FiLock,
  FiImage,
  FiMessageCircle,
  FiMail,
  FiAlertCircle,
} from 'react-icons/fi';

export default function HomeContent() {
  const [quote, setQuote] = useState<DailyQuote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyQuote = async () => {
      try {
        const res = await fetch('/api/daily-quotes');
        const quotes: DailyQuote[] = await res.json();
        const activeQuote = quotes.find(q => q.isActive) || quotes[0] || null;
        setQuote(activeQuote);
      } catch (error) {
        console.error('Error fetching daily quote:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyQuote();
  }, []);

  return (
    <div className="min-h-screen px-0 py-4 sm:p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
        {/* Welcome Section */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="inline-block">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-pastel-pink-500 rounded-full flex items-center justify-center shadow-xl mb-4 sm:mb-6 mx-auto">
              <FiHeart className="text-white text-4xl sm:text-5xl" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-700 mb-3 sm:mb-4 px-2">
            Котёнок, я рядом. Всегда.
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto px-2">
            Это место создано, чтобы ты открывал и чувствовал: я с тобой. Здесь наши мемы, мои напоминания, твоя поддержка и немного моей любви в коде.
          </p>
        </div>

        {/* Daily Quote */}
        <div className="card p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pastel-pink-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <FiSun className="text-white text-lg sm:text-xl" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3">
                Сообщение на сегодня
              </h2>

              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-pastel-blue-200 rounded w-3/4" />
                  <div className="h-4 bg-pastel-blue-200 rounded w-1/2" />
                </div>
              ) : quote ? (
                <>
                  <p className="text-lg text-gray-600 leading-relaxed italic mb-2">
                    &quot;{quote.quote}&quot;
                  </p>
                  {quote.author && (
                    <p className="text-sm text-gray-500">— {quote.author}</p>
                  )}
                </>
              ) : (
                <p className="text-lg text-gray-600 leading-relaxed italic">
                  &quot;Ты справишься. И ты знаешь, что я на твоей стороне.&quot;
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <a href="/memes" className="card group cursor-pointer block p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pastel-mint-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                <FiImage className="text-white text-xl sm:text-2xl" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-xl font-semibold text-gray-700 mb-0.5 sm:mb-1">
                  Общие мемы
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">Наши общие мемы</p>
              </div>
            </div>
          </a>

          <a href="/crisis" className="card group cursor-pointer block p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pastel-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                <FiAlertCircle className="text-white text-xl sm:text-2xl" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-xl font-semibold text-gray-700 mb-0.5 sm:mb-1">
                  Если трудно
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">Я здесь в трудные моменты</p>
              </div>
            </div>
          </a>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <a href="/why-you-matter" className="btn-primary flex items-center justify-center gap-2 py-4 px-4 min-h-[56px] sm:min-h-0">
            <FiHeart size={20} />
            <span className="text-sm truncate">Почему ты лучший</span>
          </a>

          <a href="/my-feelings" className="btn-primary flex items-center justify-center gap-2 py-4 px-4 min-h-[56px] sm:min-h-0 bg-pastel-mint-500 hover:bg-pastel-mint-600">
            <FiBookOpen size={20} />
            <span className="text-sm truncate">Мои чувства</span>
          </a>

          <a href="/memes" className="btn-primary flex items-center justify-center gap-2 py-4 px-4 min-h-[56px] sm:min-h-0 bg-gray-500 hover:bg-gray-600">
            <FiImage size={20} />
            <span className="text-sm truncate">Мемы</span>
          </a>

          <a href="/puns" className="btn-primary flex items-center justify-center gap-2 py-4 px-4 min-h-[56px] sm:min-h-0 bg-pastel-mint-500 hover:bg-pastel-mint-600">
            <FiMessageCircle size={20} />
            <span className="text-sm truncate">Каламбуры</span>
          </a>

          <a href="/letters" className="btn-primary flex items-center justify-center gap-2 py-4 px-4 min-h-[56px] sm:min-h-0 bg-gray-500 hover:bg-gray-600">
            <FiMail size={20} />
            <span className="text-sm truncate">Мысли и напутствия</span>
          </a>

          <a href="/secret-room" className="btn-primary flex items-center justify-center gap-2 py-4 px-4 min-h-[56px] sm:min-h-0 bg-gray-600 hover:bg-gray-700">
            <FiLock size={20} />
            <span className="text-sm truncate">Секретная комната</span>
          </a>

          <a href="/final-letter" className="btn-primary flex items-center justify-center gap-2 py-4 px-4 min-h-[56px] sm:min-h-0 bg-pastel-yellow-400 hover:bg-pastel-yellow-500 text-gray-800">
            <FiFeather size={20} />
            <span className="text-sm truncate">Главное напутствие</span>
          </a>
        </div>

        <div className="text-center py-6 sm:py-8 px-2">
          <p className="text-gray-500 italic text-base sm:text-lg">
            Заглядывай в меню — там всё, что я для тебя оставила.
          </p>
        </div>
      </div>
    </div>
  );
}
