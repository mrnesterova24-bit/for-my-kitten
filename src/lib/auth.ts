import { User } from '@/types';

// Authentication types
export interface AuthUser {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  displayName?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Mock users for development (replace with real authentication)
const MOCK_USERS = [
  {
    uid: 'admin-user-1',
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com',
    password: 'love', // In real app, this would be hashed
    role: 'admin' as const,
    displayName: 'Admin User',
    createdAt: new Date().toISOString()
  },
  {
    uid: 'user-1',
    email: 'user@example.com',
    password: 'user123', // In real app, this would be hashed
    role: 'user' as const,
    displayName: 'Rishat',
    createdAt: new Date().toISOString()
  }
];

// Authentication state
let currentUser: AuthUser | null = null;

// Initialize with admin user for development
export const initializeAuth = () => {
  // In development, auto-login admin user
  if (process.env.NODE_ENV === 'development') {
    const adminUser = MOCK_USERS.find(u => u.role === 'admin');
    if (adminUser) {
      currentUser = {
        uid: adminUser.uid,
        email: adminUser.email,
        role: adminUser.role,
        displayName: adminUser.displayName,
        createdAt: adminUser.createdAt
      };
    }
  }
};

// Authentication functions
export const signIn = async (email: string, password: string): Promise<AuthUser> => {
  // In real app, this would call your authentication API
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  currentUser = {
    uid: user.uid,
    email: user.email,
    role: user.role,
    displayName: user.displayName,
    createdAt: user.createdAt
  };
  
  // Store auth token in localStorage (in real app, use secure httpOnly cookies)
  localStorage.setItem('auth_token', JSON.stringify({
    uid: user.uid,
    email: user.email,
    role: user.role,
    timestamp: Date.now()
  }));
  
  return currentUser;
};

export const signOut = async (): Promise<void> => {
  currentUser = null;
  localStorage.removeItem('auth_token');
};

export const getCurrentUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  if (!currentUser) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        const user = MOCK_USERS.find(u => u.uid === parsedToken.uid);
        if (user) {
          currentUser = {
            uid: user.uid,
            email: user.email,
            role: user.role,
            displayName: user.displayName,
            createdAt: user.createdAt
          };
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
        localStorage.removeItem('auth_token');
      }
    }
  }
  
  return currentUser;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

export const isUser = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'user';
};

// Initialize auth on module load
initializeAuth();