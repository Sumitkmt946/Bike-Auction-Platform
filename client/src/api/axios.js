import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ── Request Interceptor: Attach JWT ────────────────────────────────── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response Interceptor: Handle 401 & Unwrap Data ──────────────────── */
api.interceptors.response.use(
  (response) => {
    // If backend wrapped response in { success: true, data: ... }, unwrap it
    if (response.data && typeof response.data === 'object' && response.data.success !== undefined) {
      if (response.data.data !== undefined) {
        response.data = response.data.data;
      }
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on login/register
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
