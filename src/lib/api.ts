import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from './constants';
import type { ApiError } from '@/types';

/**
 * Create axios instance with base configuration
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

/**
 * Request interceptor - Add auth token to requests
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors globally
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized - but only for authenticated requests, not login/signup attempts
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const method = error.config?.method?.toLowerCase() || '';
      
      // Check if this is an authentication endpoint (login, signup, password reset)
      // We check both the URL path and the request method
      const isAuthEndpoint = 
        url.includes('/auth/login') || 
        url.includes('/auth/signup') ||
        url.includes('/auth/forgot-password') ||
        url.includes('/auth/reset-password') ||
        url.includes('/auth/verify');
      
      // Check if we're currently on an auth page
      const currentPath = window.location.pathname;
      const isOnAuthPage = 
        currentPath.includes('/login') || 
        currentPath.includes('/signup') ||
        currentPath.includes('/forgot-password') ||
        currentPath.includes('/reset-password') ||
        currentPath.includes('/verify-email');
      
      // NEVER redirect if:
      // 1. It's a POST request to an auth endpoint (login/signup attempts)
      // 2. We're already on an auth page
      // This prevents redirects during login/signup attempts
      const shouldNotRedirect = 
        (method === 'post' && isAuthEndpoint) || 
        isOnAuthPage ||
        isAuthEndpoint;
      
      if (!shouldNotRedirect) {
        // Only clear auth and redirect for authenticated endpoints that return 401
        // This handles cases where a user's token expired while using the app
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        // Only redirect if not already on login page
        if (!currentPath.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Return error response for component-level handling
    return Promise.reject(error);
  }
);

export default api;


