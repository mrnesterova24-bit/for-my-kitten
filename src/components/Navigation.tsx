'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiMail,
  FiHeart,
  FiBookOpen,
  FiClock,
  FiStar,
  FiGift,
  FiLock,
  FiSmile,
  FiMapPin,
  FiAlertCircle,
  FiFeather,
  FiLogOut,
  FiMenu,
  FiX,
  FiSettings,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';

const mainNavItems = [
  { href: '/', label: 'Главная', icon: FiHome },
  { href: '/letters', label: 'Письма от меня', icon: FiMail },
  { href: '/why-you-matter', label: 'Почему ты важен', icon: FiHeart },
  { href: '/my-feelings', label: 'Мои чувства', icon: FiBookOpen },
  { href: '/our-story', label: 'Наша история', icon: FiClock },
  { href: '/our-future', label: 'Наше будущее', icon: FiStar },
  { href: '/surprises', label: 'Сюрпризы', icon: FiGift },
  { href: '/secret-room', label: 'Секретная комната', icon: FiLock },
  { href: '/rituals', label: 'Наши ритуалы', icon: FiSmile },
  { href: '/apart', label: 'Когда мы далеко', icon: FiMapPin },
  { href: '/crisis', label: 'Поддержка в кризис', icon: FiAlertCircle },
  { href: '/final-letter', label: 'Главное письмо', icon: FiFeather },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 lg:hidden romantic-button w-12 h-12 flex items-center justify-center p-0"
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
        initial={{ x: '-100%' }}
        animate={{
          x: isOpen ? 0 : '-100%',
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 h-full bg-white/95 backdrop-blur-lg shadow-2xl z-40 w-80 overflow-y-auto translate-x-0 block"
      >
        <div className="p-6 space-y-6">
          {/* Logo/Title */}
          <div className="text-center pt-12 lg:pt-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pastel-pink-400 to-pastel-purple-500 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
                <FiHeart className="text-white text-3xl" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-rose-700">
              Ришат
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
                      'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-pastel-pink-400 to-pastel-purple-500 text-white shadow-md'
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
            <div className="pt-4 border-t border-pastel-pink-100">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-pastel-purple-600 hover:bg-pastel-purple-50 transition-all duration-200"
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-pastel-blue-600 hover:bg-pastel-blue-50 transition-all duration-200"
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
