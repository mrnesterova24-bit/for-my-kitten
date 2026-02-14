'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  FiMail,
  FiHeart,
  FiBookOpen,
  FiLock,
  FiImage,
  FiMessageCircle,
  FiAlertCircle,
  FiFeather,
  FiSun,
} from 'react-icons/fi';

const adminSections = [
  {
    title: 'Цитаты дня',
    icon: FiSun,
    href: '/admin/daily-quotes',
    color: 'from-yellow-400 to-yellow-500',
    description: 'Управление ежедневными сообщениями',
  },
  {
    title: 'Мемы',
    icon: FiImage,
    href: '/admin/memes',
    color: 'from-pastel-mint-400 to-pastel-mint-500',
    description: 'Общие мемы',
  },
  {
    title: 'Каламбуры',
    icon: FiMessageCircle,
    href: '/admin/puns',
    color: 'from-pastel-pink-400 to-pastel-pink-500',
    description: 'Мои каламбуры и шутки',
  },
  {
    title: 'Мысли и напутствия',
    icon: FiMail,
    href: '/admin/letters',
    color: 'from-blue-400 to-blue-500',
    description: 'Создание и редактирование мыслей и напутствий',
  },
  {
    title: 'Почему ты самый лучший',
    icon: FiHeart,
    href: '/admin/reasons',
    color: 'from-rose-400 to-rose-500',
    description: 'Управление карточками причин',
  },
  {
    title: 'Мои чувства',
    icon: FiBookOpen,
    href: '/admin/feelings',
    color: 'from-purple-400 to-purple-500',
    description: 'Написать об эмоциях',
  },
  {
    title: 'Секретная комната',
    icon: FiLock,
    href: '/admin/secret-room',
    color: 'from-gray-600 to-gray-700',
    description: 'Приватный контент',
  },
  {
    title: 'Если трудно',
    icon: FiAlertCircle,
    href: '/admin/crisis',
    color: 'from-red-400 to-red-500',
    description: 'Поддержка в кризис',
  },
  {
    title: 'Главное напутствие',
    icon: FiFeather,
    href: '/admin/final-letter',
    color: 'from-amber-400 to-amber-500',
    description: 'Основное напутствие',
  },
];

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-display font-bold text-purple-700 mb-4">
              Панель управления
            </h1>
            <p className="text-xl text-gray-600">
              Здесь ты редактируешь весь контент
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={section.href}
                    className="block romantic-card group hover:shadow-2xl transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0`}
                      >
                        <Icon className="text-white text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-display font-semibold text-gray-800 mb-2">
                          {section.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 romantic-card bg-gradient-to-br from-purple-50 to-pink-50"
          >
            <h2 className="text-2xl font-display font-semibold text-purple-700 mb-4">
              Быстрые подсказки
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Используй навигацию для доступа к различным разделам контента</li>
              <li>• Все изменения сохраняются в файлах в папке src/data</li>
              <li>• Изображения: вставляй ссылки на картинки (URL)</li>
              <li>• Можешь открыть сайт и посмотреть, как всё выглядит для пользователя</li>
              <li>• Мемы и каламбуры добавляются через соответствующие разделы</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
