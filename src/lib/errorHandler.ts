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
    const responseData = error.response.data;
    
    // Handle different response formats
    // Format 1: { success: false, error: "message" }
    // Format 2: { error: "message" }
    // Format 3: { message: "message" }
    if (responseData && typeof responseData === 'object') {
      // Check for 'error' field first (most common)
      if ('error' in responseData && typeof responseData.error === 'string' && responseData.error) {
        return responseData.error;
      }
      // Check for 'message' field
      if ('message' in responseData && typeof responseData.message === 'string' && responseData.message) {
        return responseData.message;
      }
    }
    
    // Legacy: Try as ApiError type
    const apiError = responseData as ApiError;
    if (apiError?.error) {
      return apiError.error;
    }
    if (apiError?.message) {
      return apiError.message;
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
      case 429: {
        // Try to get detailed rate limit message
        const rateLimitMessage = getRateLimitMessage(error);
        if (rateLimitMessage) {
          return rateLimitMessage;
        }
        // Fallback to generic message
        return 'Too many requests. Please wait a moment and try again.';
      }
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

/**
 * Rate limit information extracted from response headers
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  retryAfter?: number; // Seconds until retry is allowed
}

/**
 * Extract rate limit information from error response headers
 */
export const getRateLimitInfo = (error: unknown): RateLimitInfo | null => {
  if (error instanceof AxiosError && error.response?.status === 429) {
    const headers = error.response.headers;
    const limit = headers['x-ratelimit-limit'] ? parseInt(headers['x-ratelimit-limit'], 10) : 0;
    const remaining = headers['x-ratelimit-remaining'] ? parseInt(headers['x-ratelimit-remaining'], 10) : 0;
    const reset = headers['x-ratelimit-reset'] ? parseInt(headers['x-ratelimit-reset'], 10) : 0;
    const retryAfter = headers['retry-after'] ? parseInt(headers['retry-after'], 10) : undefined;

    if (limit > 0 || remaining >= 0 || reset > 0) {
      return { limit, remaining, reset, retryAfter };
    }
  }
  return null;
};

/**
 * Format time until rate limit resets (human-readable)
 */
export const formatRetryTime = (resetTimestamp: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const secondsUntilReset = resetTimestamp - now;

  if (secondsUntilReset <= 0) {
    return 'now';
  }

  if (secondsUntilReset < 60) {
    return `in ${secondsUntilReset} second${secondsUntilReset !== 1 ? 's' : ''}`;
  }

  const minutesUntilReset = Math.floor(secondsUntilReset / 60);
  if (minutesUntilReset < 60) {
    return `in ${minutesUntilReset} minute${minutesUntilReset !== 1 ? 's' : ''}`;
  }

  const hoursUntilReset = Math.floor(minutesUntilReset / 60);
  return `in ${hoursUntilReset} hour${hoursUntilReset !== 1 ? 's' : ''}`;
};

/**
 * Get enhanced error message for rate limit errors
 */
export const getRateLimitMessage = (error: unknown): string | null => {
  const rateLimitInfo = getRateLimitInfo(error);
  if (!rateLimitInfo) {
    return null;
  }

  const { limit, remaining, reset, retryAfter } = rateLimitInfo;
  
  // Use retryAfter if available (more accurate)
  if (retryAfter !== undefined) {
    if (retryAfter < 60) {
      return `Too many attempts. Please try again in ${retryAfter} second${retryAfter !== 1 ? 's' : ''}.`;
    }
    const minutes = Math.floor(retryAfter / 60);
    if (minutes < 60) {
      return `Too many attempts. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`;
    }
    const hours = Math.floor(minutes / 60);
    return `Too many attempts. Please try again in ${hours} hour${hours !== 1 ? 's' : ''}.`;
  }

  // Fallback to reset timestamp
  if (reset > 0) {
    const retryTime = formatRetryTime(reset);
    return `Too many attempts. You can try again ${retryTime}.`;
  }

  // Generic message with remaining attempts
  if (limit > 0 && remaining >= 0) {
    return `Too many attempts. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining. Please try again later.`;
  }

  return 'Too many attempts. Please try again later.';
};

