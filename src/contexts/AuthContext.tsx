import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginData, SignupData } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { authService } from '@/services';
import { getErrorMessage } from '@/lib/errorHandler';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          // Validate user object has required fields
          if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.role) {
            setUser(parsedUser);
          } else {
            console.error('Invalid user data in storage');
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          }
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      
      // Validate response structure
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid login response from server');
      }
      
      // Validate user object has required fields
      if (!response.user.id || !response.user.email || !response.user.role) {
        throw new Error('Invalid user data received from server');
      }
      
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      setUser(response.user);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      await authService.signup(data);
      // Signup successful - user can now login
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

