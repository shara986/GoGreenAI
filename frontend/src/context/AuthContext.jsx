import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on initial render (only from sessionStorage so reopening website forces logout)
  useEffect(() => {
    try {
      // Clear legacy localStorage data so previous user is never restored automatically
      localStorage.removeItem('gogreen_token');
      localStorage.removeItem('gogreen_user');

      const savedToken = sessionStorage.getItem('gogreen_token');
      const savedUser = sessionStorage.getItem('gogreen_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to restore authentication state:', e);
      sessionStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    const { accessToken, user: userData } = response.data.data;

    // Use sessionStorage so session ends when browser/tab is closed & reopened
    sessionStorage.setItem('gogreen_token', accessToken);
    sessionStorage.setItem('gogreen_user', JSON.stringify(userData));
    localStorage.removeItem('gogreen_token');
    localStorage.removeItem('gogreen_user');

    setToken(accessToken);
    setUser(userData);
    return userData;
  }, []);

  const registerCustomer = useCallback(async (data) => {
    const response = await authService.registerCustomer(data);
    return response.data;
  }, []);

  const registerNursery = useCallback(async (data) => {
    const response = await authService.registerNursery(data);
    return response.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('gogreen_token');
    localStorage.removeItem('gogreen_user');
    sessionStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  const getDashboardPath = useCallback((roleToUse = user?.role) => {
    switch (roleToUse) {
      case 'ROLE_CUSTOMER':
        return '/customer/dashboard';
      case 'ROLE_NURSERY_OWNER':
        return '/nursery/dashboard';
      case 'ROLE_ADMIN':
        return '/admin/dashboard';
      default:
        return '/';
    }
  }, [user?.role]);

  const isAuthenticated = !!token && !!user;
  const role = user?.role || null;
  const isAdmin = role === 'ROLE_ADMIN';
  const isNurseryOwner = role === 'ROLE_NURSERY_OWNER';
  const isCustomer = role === 'ROLE_CUSTOMER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        isAuthenticated,
        isAdmin,
        isNurseryOwner,
        isCustomer,
        login,
        registerCustomer,
        registerNursery,
        logout,
        getDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
