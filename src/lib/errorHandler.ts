import { AxiosError } from 'axios';
import type { ApiError } from '@/types';

/**
 * Extract user-friendly error message from API error
 */
export const getErrorMessage = (error: unknown): string => {
  // Network error or no response
  if (error instanceof AxiosError) {
    // Network error (no internet, server down, etc.)
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return 'Request timed out. Please check your connection and try again.';
      }
      if (error.message.includes('Network Error')) {
        return 'Network error. Please check your internet connection and try again.';
      }
      return 'Unable to connect to server. Please try again later.';
    }

    // Server responded with error
    const apiError = error.response.data as ApiError;
    
    // Check if there's a main error message
    if (apiError?.error) {
      return apiError.error;
    }

    // Check for field-specific errors
    if (apiError?.errors && typeof apiError.errors === 'object') {
      const errorMessages = Object.values(apiError.errors);
      if (errorMessages.length > 0) {
        // If errors is an object with string values
        const firstError = errorMessages[0];
        if (typeof firstError === 'string') {
          return firstError;
        }
        // If errors is an object with array values
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0];
        }
      }
    }

    // Fallback to status-based messages
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Invalid credentials. Please check your email and password.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `An error occurred (${error.response.status}). Please try again.`;
    }
  }

  // Regular Error object
  if (error instanceof Error) {
    return error.message;
  }

  // Unknown error type
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Extract field-specific errors from API error response
 */
export const getFieldErrors = (error: unknown): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};

  if (error instanceof AxiosError && error.response?.data) {
    const apiError = error.response.data as ApiError;
    
    if (apiError?.errors && typeof apiError.errors === 'object') {
      Object.entries(apiError.errors).forEach(([field, messages]) => {
        if (typeof messages === 'string') {
          fieldErrors[field] = messages;
        } else if (Array.isArray(messages) && messages.length > 0) {
          fieldErrors[field] = messages[0];
        }
      });
    }
  }

  return fieldErrors;
};

/**
 * Check if error is a network/connection error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response || error.code === 'ECONNABORTED' || error.message.includes('Network Error');
  }
  return false;
};

/**
 * Check if error is a validation error (400)
 */
export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 400;
  }
  return false;
};

