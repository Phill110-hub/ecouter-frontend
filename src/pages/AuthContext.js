// src/pages/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [user, setUser] = useState(null);

  const fetchSession = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/session`,
        { withCredentials: true }
      );

      if (res.data && res.data.email) {
        setIsAuthenticated(true);
        setUser(res.data);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error('❌ Session check failed:', err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    setLogoutLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error('❌ Logout failed:', err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setLogoutLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        logoutLoading,
        setIsAuthenticated,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
