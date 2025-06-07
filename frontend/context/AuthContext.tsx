import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '@/service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  session: any;
  isLoading: boolean;
};

const STORAGE_KEY = '@user_session';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          setSession(parsedSession);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
        console.log('Finished loading auth state');
      }
    };

    restoreSession();
  }, []);

  const saveSession = async (session: any) => {
    if (session) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      console.log('Session saved:', session);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('Session removed');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await api.login(email, password);
      setIsAuthenticated(true);
      setSession(result);
      await saveSession(result);
      console.log('Login result session:', result); // debug
    } catch (error: any) {
      setIsAuthenticated(false);
      setSession(null);
      await saveSession(null);
      throw new Error(error.message || 'Login failed');
    }
  };


  const signup = async (email: string, password: string) => {
    try {
      const result = await api.signup(email, password);
      setIsAuthenticated(true);
      setSession(result.session || result.user);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(result.session || result.user));
    } catch (error: any) {
      setIsAuthenticated(false);
      setSession(null);
      throw new Error(error.message || 'Signup failed');
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setIsAuthenticated(false);
      setSession(null);
      await AsyncStorage.removeItem('@user_session');
    } catch (error: any) {
      console.error('Logout failed:', error.message || error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        session,
        login,
        signup,
        logout,
        isLoading,
      }}
    >
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
