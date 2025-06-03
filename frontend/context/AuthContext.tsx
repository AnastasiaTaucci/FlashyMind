import React, { createContext, useContext, useState } from "react";
import * as api from "@/service/api";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  session: any;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<any>(null);

  const login = async (email: string, password: string) => {
    try {
      const result = await api.login(email, password);
      setIsAuthenticated(true);
      setSession(result.session);
    } catch (error: any) {
      setIsAuthenticated(false);
      setSession(null);
      throw new Error(error.message || "Login failed");
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const result = await api.signup(email, password);
      setIsAuthenticated(true);
      setSession(result.session || result.user);
    } catch (error: any) {
      setIsAuthenticated(false);
      setSession(null);
      throw new Error(error.message || "Signup failed");
    }
  };

  const logout = () => {
    // Call API logout here
    setIsAuthenticated(false);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        session,
        login,
        signup,
        logout,
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
