import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, register as registerApi } from '../api/authApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          const decoded = decodeToken(storedToken);
          if (decoded) {
            const userInfo = {
              id: decoded.id || decoded.sub,
              email: decoded.email || decoded.sub,
              fullName: decoded.fullName || decoded.name || 'User',
              role: decoded.role || 'USER',
            };
            setUser(userInfo);
            localStorage.setItem('user', JSON.stringify(userInfo));
          }
        }
      } else {
        const decoded = decodeToken(storedToken);
        if (decoded) {
          const userInfo = {
            id: decoded.id || decoded.sub,
            email: decoded.email || decoded.sub,
            fullName: decoded.fullName || decoded.name || 'User',
            role: decoded.role || 'USER',
          };
          setUser(userInfo);
          localStorage.setItem('user', JSON.stringify(userInfo));
        }
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await loginApi(email, password);
    const responseData = response.data || response;
    const newToken = responseData.token || responseData.jwt || responseData.accessToken;
    if (!newToken) throw new Error('No token received from server');

    localStorage.setItem('token', newToken);
    setToken(newToken);

    const decoded = decodeToken(newToken);
    const userObj = responseData.user || responseData;
    const userRole = (userObj.roles && Array.isArray(userObj.roles) && userObj.roles[0]) 
                  || userObj.role 
                  || (decoded?.roles && decoded.roles[0])
                  || decoded?.role 
                  || 'USER';

    const userInfo = {
      id: userObj.id || decoded?.id || decoded?.sub,
      email: userObj.email || decoded?.email || email,
      fullName: userObj.fullName || userObj.name || decoded?.fullName || decoded?.name || 'User',
      role: userRole,
      phone: userObj.phone || '',
    };

    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    return userInfo;
  }, []);

  const register = useCallback(async (fullName, email, password, phone) => {
    const response = await registerApi(fullName, email, password, phone);
    const responseData = response.data || response;
    const newToken = responseData.token || responseData.jwt || responseData.accessToken;

    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);

      const decoded = decodeToken(newToken);
      const userObj = responseData.user || responseData;
      const userRole = (userObj.roles && Array.isArray(userObj.roles) && userObj.roles[0]) 
                    || userObj.role 
                    || (decoded?.roles && decoded.roles[0])
                    || decoded?.role 
                    || 'USER';

      const userInfo = {
        id: userObj.id || decoded?.id || decoded?.sub,
        email: userObj.email || decoded?.email || email,
        fullName: userObj.fullName || userObj.name || fullName,
        role: userRole,
        phone: userObj.phone || phone || '',
      };

      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      return userInfo;
    }

    return response;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';

  const value = {
    user,
    token,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
