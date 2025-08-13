import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI, getToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await adminAPI.verifyToken();
      setUser({ username: response.user });
    } catch (error) {
      console.error('Token verification failed:', error);
      adminAPI.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await adminAPI.login(credentials);
      setUser({ username: credentials.username });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    adminAPI.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};