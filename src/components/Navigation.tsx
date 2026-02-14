'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiMail,
  FiHeart,
  FiBookOpen,
  FiLock,
  FiAlertCircle,
  FiFeather,
  FiLogOut,
  FiMenu,
  FiX,
  FiSettings,
  FiImage,
  FiMessageCircle,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';

const mainNavItems = [
  { href: '/', label: 'Главная', icon: FiHome },
  { href: '/letters', label: 'Мысли и напутствия', icon: FiMail },
  { href: '/why-you-matter', label: 'Почему ты самый лучший', icon: FiHeart },
  { href: '/my-feelings', label: 'Мои чувства', icon: FiBookOpen },
  { href: '/memes', label: 'Общие мемы', icon: FiImage },
  { href: '/puns', label: 'Мои каламбуры', icon: FiMessageCircle },
  { href: '/secret-room', label: 'Секретная комната', icon: FiLock },
  { href: '/crisis', label: 'Если трудно', icon: FiAlertCircle },
  { href: '/final-letter', label: 'Главное напутствие', icon: FiFeather },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();
  const { signOut, isAdmin } = useAuth();

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const fn = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Кнопка меню: на мобильных открывает боковую панель; на десктопе панель всегда видна — кнопку скрываем */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 lg:hidden btn-primary w-12 h-12 min-h-[48px] min-w-[48px] flex items-center justify-center p-0"
        style={{
          top: 'max(1.5rem, calc(1.5rem + env(safe-area-inset-top, 0px)))',
          left: 'max(1.5rem, calc(1.5rem + env(safe-area-inset-left, 0px)))',
        }}
        aria-label="Меню"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Navigation Sidebar */}
      <motion.nav
        initial={false}
        animate={{
          x: isOpen || isDesktop ? 0 : '-100%',
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 h-full bg-white/95 backdrop-blur-lg shadow-2xl z-40 w-[min(20rem,100vw)] max-w-[85vw] sm:max-w-none sm:w-80 overflow-y-auto"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Logo/Title */}
          <div className="text-center pt-10 sm:pt-12 lg:pt-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block"
            >
              <div className="w-16 h-16 bg-pastel-pink-500 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
                <FiHeart className="text-white text-3xl" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-pastel-pink-700">
              Котёнок
            </h2>
            <p className="text-sm text-gray-500 italic">Я здесь</p>
          </div>

          {/* Navigation Links */}
          <ul className="space-y-2">
            {mainNavItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-2xl transition-all duration-200',
                      isActive
                        ? 'bg-pastel-pink-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-pastel-pink-50 hover:text-pastel-pink-600'
                    )}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          {/* Admin Panel Link */}
          {isAdmin && (
            <div className="pt-4 border-t border-pastel-blue-100">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-2xl text-pastel-pink-600 hover:bg-pastel-pink-50 transition-all duration-200"
              >
                <FiSettings size={20} />
                <span className="font-medium">Панель управления</span>
              </Link>
            </div>
          )}

          {/* Sign Out Button */}
          <div className="pt-2">
            <button
              onClick={handleSignOut}
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-2xl text-gray-600 hover:bg-pastel-pink-50 transition-all duration-200"
            >
              <FiLogOut size={20} />
              <span className="font-medium">Выйти</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Main content spacer for desktop */}
      <div className="hidden lg:block w-80" />
    </>
  );
}
