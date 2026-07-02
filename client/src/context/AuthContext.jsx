import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  /* ── Fetch current user on mount / token change ──────────────────── */
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data?.data?.user || data?.user || data);
      } catch {
        // Token invalid — clean up
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  /* ── Login ───────────────────────────────────────────────────────── */
  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const jwt = data?.data?.token || data?.token;
    const userData = data?.data?.user || data?.user || data;
    localStorage.setItem('token', jwt);
    setToken(jwt);
    setUser(userData);
    toast.success('Welcome back!');
    return userData;
  }, []);

  /* ── Register ────────────────────────────────────────────────────── */
  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    const jwt = data?.data?.token || data?.token;
    const userData = data?.data?.user || data?.user || data;
    localStorage.setItem('token', jwt);
    setToken(jwt);
    setUser(userData);
    toast.success('Account created successfully!');
    return userData;
  }, []);

  /* ── Logout ──────────────────────────────────────────────────────── */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out');
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
