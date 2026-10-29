import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { DEMO_USER, INITIAL_USERS } from '../utils/seedData';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  signOut: () => void;
  demoLogin: () => void;
  alert: { type: 'error' | 'success' | 'info'; message: string } | null;
  clearAlert: () => void;
  showAlert: (type: 'error' | 'success' | 'info', message: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'jobtrack_users_v1';
const CURRENT_USER_KEY = 'jobtrack_current_user_id_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored users:', e);
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CURRENT_USER_KEY);
    } catch {
      return null;
    }
  });

  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users:', e);
    }
  }, [users]);

  // Sync current user ID to localStorage
  useEffect(() => {
    try {
      if (currentUserId) {
        localStorage.setItem(CURRENT_USER_KEY, currentUserId);
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to sync current user:', e);
    }
  }, [currentUserId]);

  const showAlert = (type: 'error' | 'success' | 'info', message: string) => {
    setAlert({ type, message });
    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        setAlert((prev) => (prev?.message === message ? null : prev));
      }, 5000);
    }
  };

  const clearAlert = () => setAlert(null);

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  const signIn = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      const msg = 'Please enter your email address.';
      showAlert('error', msg);
      return { success: false, error: msg };
    }

    const found = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (!found) {
      const msg = 'No account found with this email. Please check your spelling or sign up.';
      showAlert('error', msg);
      return { success: false, error: msg };
    }

    if (found.password && password && found.password !== password) {
      const msg = 'Incorrect password. Please try again or use password reset.';
      showAlert('error', msg);
      return { success: false, error: msg };
    }

    setCurrentUserId(found.id);
    showAlert('success', `Welcome back, ${found.name}!`);
    return { success: true };
  };

  const signUp = async (name: string, email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      const msg = 'Please provide your full name.';
      showAlert('error', msg);
      return { success: false, error: msg };
    }

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      const msg = 'Please provide a valid email address.';
      showAlert('error', msg);
      return { success: false, error: msg };
    }

    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      const msg = 'An account with this email already exists. Please log in instead.';
      showAlert('error', msg);
      return { success: false, error: msg };
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: trimmedName,
      email: trimmedEmail,
      password: password || 'password123',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    showAlert('success', `Account created successfully! Welcome to JobTrack, ${newUser.name}.`);
    return { success: true };
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      const msg = 'Please enter your registered email address to receive reset instructions.';
      showAlert('error', msg);
      return { success: false, error: msg };
    }

    const userExists = users.some((u) => u.email.toLowerCase() === trimmedEmail);
    if (!userExists) {
      const msg = `We couldn't find an account matching "${trimmedEmail}". Please verify your email.`;
      showAlert('error', msg);
      return { success: false, error: msg };
    }

    const msg = `Password reset email dispatched to ${trimmedEmail}! Follow the link in your inbox to set a new password.`;
    showAlert('info', msg);
    return { success: true, message: msg };
  };

  const signOut = () => {
    setCurrentUserId(null);
    showAlert('info', 'You have been logged out securely.');
  };

  const demoLogin = () => {
    // Ensure demo user exists
    if (!users.some((u) => u.id === DEMO_USER.id)) {
      setUsers((prev) => [DEMO_USER, ...prev]);
    }
    setCurrentUserId(DEMO_USER.id);
    showAlert('success', 'Logged in as Demo User (Alex Rivera). Explore the full job tracking suite!');
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        signIn,
        signUp,
        resetPassword,
        signOut,
        demoLogin,
        alert,
        clearAlert,
        showAlert,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
