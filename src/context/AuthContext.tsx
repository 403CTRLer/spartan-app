'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthState, User } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'spartan_user',
  TOKEN: 'spartan_token',
  USERS_DB: 'spartan_users_db',
};

// Simulated user database in localStorage
interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser) as User;
          setState({
            user,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const getUsersDB = (): StoredUser[] => {
    try {
      const db = localStorage.getItem(STORAGE_KEYS.USERS_DB);
      return db ? JSON.parse(db) : [];
    } catch {
      return [];
    }
  };

  const saveUsersDB = (users: StoredUser[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
  };

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const usersDB = getUsersDB();
    const foundUser = usersDB.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const user: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };
      const token = `fake_token_${Date.now()}`;

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }

    return false;
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const usersDB = getUsersDB();

      // Check if user already exists
      if (usersDB.some(u => u.email === email)) {
        return false;
      }

      const newUser: StoredUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password,
        role: 'Admin',
      };

      usersDB.push(newUser);
      saveUsersDB(usersDB);

      // Auto login after signup
      const user: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };
      const token = `fake_token_${Date.now()}`;

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
