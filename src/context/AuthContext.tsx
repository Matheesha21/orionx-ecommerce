import React, { useEffect, useState, createContext, useContext } from 'react';
import { User } from '../types';
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (
  email: string,
  password: string)
  => Promise<{
    success: boolean;
    message: string;
  }>;
  register: (
  name: string,
  email: string,
  password: string)
  => Promise<{
    success: boolean;
    message: string;
  }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'orionx-auth';
// Mock users for demo
const mockUsers: {
  email: string;
  password: string;
  user: User;
}[] = [
{
  email: 'admin@orionx.com',
  password: 'admin123',
  user: {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@orionx.com',
    role: 'admin',
    avatar:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    addresses: [],
    createdAt: '2024-01-01T00:00:00Z'
  }
},
{
  email: 'demo@orionx.com',
  password: 'demo123',
  user: {
    id: 'user-1',
    name: 'Demo User',
    email: 'demo@orionx.com',
    role: 'customer',
    avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    addresses: [
    {
      id: 'addr-1',
      name: 'Home',
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      phone: '(555) 123-4567',
      isDefault: true
    }],

    createdAt: '2024-01-15T00:00:00Z'
  }
}];

export function AuthProvider({ children }: {children: ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  // Load user from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setUser(parsed);
      } catch (e) {
        console.error('Failed to load auth from localStorage');
      }
    }
  }, []);
  // Save user to localStorage on change
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);
  const login = async (
  email: string,
  password: string)
  : Promise<{
    success: boolean;
    message: string;
  }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockUser = mockUsers.find(
      (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
    );
    if (mockUser) {
      setUser(mockUser.user);
      return {
        success: true,
        message: 'Login successful!'
      };
    }
    return {
      success: false,
      message: 'Invalid email or password'
    };
  };
  const register = async (
  name: string,
  email: string,
  password: string)
  : Promise<{
    success: boolean;
    message: string;
  }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Check if email already exists
    const exists = mockUsers.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return {
        success: false,
        message: 'Email already registered'
      };
    }
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'customer',
      addresses: [],
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    return {
      success: true,
      message: 'Registration successful!'
    };
  };
  const logout = () => {
    setUser(null);
  };
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({
        ...user,
        ...updates
      });
    }
  };
  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser
      }}>

      {children}
    </AuthContext.Provider>);

}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}