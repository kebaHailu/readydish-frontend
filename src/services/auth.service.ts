import api from '@/lib/api';
import type { LoginData, SignupData, AuthResponse, User, ForgotPasswordData, ResetPasswordData } from '@/types';

/**
 * Authentication Service
 */

export const authService = {
  /**
   * Register a new user
   */
  async signup(data: SignupData): Promise<{ user: User; message: string }> {
    const response = await api.post<{ success: true; data: { user: User; message: string } }>('/auth/signup', data);
    return response.data.data;
  },

  /**
   * Login user and get JWT token
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<{ success: true; data: AuthResponse }>('/auth/login', data);
    return response.data.data;
  },

  /**
   * Request password reset email
   */
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await api.post<{ success: true; data: { message: string } }>('/auth/forgot-password', data);
    return response.data.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await api.post<{ success: true; data: { message: string } }>('/auth/reset-password', data);
    return response.data.data;
  },
};

