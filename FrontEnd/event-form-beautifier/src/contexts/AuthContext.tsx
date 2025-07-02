import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User } from '@/services/api';

interface AuthContextType {
  user: Partial<User> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  verifyOtpAndSetUser: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  setUser: (user: Partial<User> | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('current_user');

    const bootstrap = async () => {
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        try {
          const freshUser = await apiService.getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('current_user', JSON.stringify(freshUser));
        } catch {
          logout();
        }
      }
      setIsLoading(false); // ✅ Done loading only after bootstrap
    };

    bootstrap();
  }, []);

  const login = async (email: string) => {
    await apiService.loginWithEmail(email); // just sends OTP
  };

  const verifyOtpAndSetUser = async (email: string, otp: string) => {
    const userData = await apiService.verifyOTP(email, otp); // stores token + user
    setUser(userData);
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    verifyOtpAndSetUser,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
