import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userData: UserData | null;
  userToken: string | null;
  isLoading: boolean;
  login: (user: UserData, token?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: UserData) => Promise<void>; // <-- Ditambahkan
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user_session');
      const storedToken = await AsyncStorage.getItem('user_token');

      if (storedUser) {
        setUserData(JSON.parse(storedUser));
        setIsLoggedIn(true);
      }
      if (storedToken) {
        setUserToken(storedToken);
      }
    } catch (error) {
      console.error('Gagal memuat sesi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (user: UserData, token?: string) => {
    try {
      await AsyncStorage.setItem('user_session', JSON.stringify(user));
      setUserData(user);
      setIsLoggedIn(true);

      if (token) {
        await AsyncStorage.setItem('user_token', token);
        setUserToken(token);
      }
    } catch (error) {
      console.error('Gagal menyimpan sesi:', error);
    }
  };

  // Fungsi untuk update data profil secara instan
  const updateUser = async (user: UserData) => {
    try {
      await AsyncStorage.setItem('user_session', JSON.stringify(user));
      setUserData(user);
    } catch (error) {
      console.error('Gagal memperbarui data user:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user_session');
      await AsyncStorage.removeItem('user_token');
      setUserData(null);
      setUserToken(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Gagal menghapus sesi:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userData,
        userToken,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};