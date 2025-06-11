import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '@/service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  handleAuthError: () => void;
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
        console.log('Stored session:', storedSession);
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

      const sessionWithTimestamp = {
        ...result,
        created_at: Date.now(),
      };

      setIsAuthenticated(true);
      setSession(sessionWithTimestamp);
      await saveSession(sessionWithTimestamp);
      console.log('Login result session:', sessionWithTimestamp); // debug
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

  const handleAuthError = async () => {
    console.log('Handling auth error - logging out user');
    setIsAuthenticated(false);
    setSession(null);
    await AsyncStorage.removeItem('@user_session');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        session,
        login,
        signup,
        logout,
        handleAuthError,
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
