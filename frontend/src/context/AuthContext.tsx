import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { User } from "../types";

interface AuthUser extends User {
  isAdmin?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "orionx-auth";
const TOKEN_STORAGE_KEY = "token";
const API_BASE_URL = "http://127.0.0.1:5050/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to load auth from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      });

      const data = response.data;

      const normalizedUser: AuthUser = {
        id: data.user.id,
        name: data.user.username,
        email: data.user.email,
        role: data.user.isAdmin ? "admin" : "customer",
        isAdmin: data.user.isAdmin,
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setUser(normalizedUser);

      return {
        success: true,
        message: data.message || "Login successful!",
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Invalid email or password",
      };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      await axios.post(`${API_BASE_URL}/users/register`, {
        username: name,
        email,
        password,
      });

      const loginResult = await login(email, password);
      return loginResult;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (user) {
      setUser({
        ...user,
        ...updates,
      });
    }
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}