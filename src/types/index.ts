// ============================================
// Enums (as const objects for TypeScript compatibility)
// ============================================

/**
 * User roles in the system
 */
export const UserRole = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

/**
 * Order status values
 */
export const OrderStatus = {
  PLACED: 'placed',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

// ============================================
// User Types
// ============================================

/**
 * User entity
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User data for registration
 */
export interface SignupData {
  name: string;
  email: string;
  password: string;
}

/**
 * User data for login
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Authentication response from API
 */
export interface AuthResponse {
  token: string;
  user: User;
}

// ============================================
// Dish Types
// ============================================

/**
 * Dish/Menu item entity
 */
export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageURL?: string;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Dish creation/update data (for admin)
 */
export interface DishData {
  name: string;
  description: string;
  price: number;
  imageURL?: string;
  isAvailable?: boolean;
}

// ============================================
// Cart Types
// ============================================

/**
 * Cart item (dish with quantity)
 */
export interface CartItem {
  dish: Dish;
  quantity: number;
}

/**
 * Cart data structure
 */
export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// ============================================
// Order Types
// ============================================

/**
 * Order item (dish reference with quantity and price snapshot)
 */
export interface OrderItem {
  dishId: string;
  dishName?: string; // Optional: for display purposes
  quantity: number;
  price: number; // Price at time of order
}

/**
 * Delivery address information
 */
export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
}

/**
 * Order entity
 */
export interface Order {
  id: string;
  userId: string;
  user?: User; // Optional: populated when fetching with user details
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: DeliveryAddress;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Order creation data
 */
export interface CreateOrderData {
  items: Array<{
    dishId: string;
    quantity: number;
  }>;
  deliveryAddress: DeliveryAddress;
}

/**
 * Order status update data (for admin)
 */
export interface UpdateOrderStatusData {
  status: OrderStatus;
}

// ============================================
// Pagination Types
// ============================================

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Pagination query parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ============================================
// API Response Types
// ============================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Error response from API
 */
export interface ApiError {
  success?: false;
  error?: string; // Main error message (from backend)
  message?: string; // Alternative error message field
  errors?: Record<string, string | string[]>; // Field-specific errors (can be string or array)
  statusCode?: number;
}

// ============================================
// Form Types
// ============================================

/**
 * Forgot password request
 */
export interface ForgotPasswordData {
  email: string;
}

/**
 * Reset password data
 */
export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

/**
 * Email verification data
 */
export interface VerifyEmailData {
  token: string;
}

// ============================================
// Filter & Search Types
// ============================================

/**
 * Dish search and filter parameters
 */
export interface DishSearchParams extends PaginationParams {
  search?: string; // Search by dish name
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
}

/**
 * Order filter parameters
 */
export interface OrderFilterParams extends PaginationParams {
  status?: OrderStatus;
  userId?: string; // For admin filtering by user
}

// ============================================
// Utility Types
// ============================================

/**
 * Type helper for making certain fields optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Type helper for making certain fields required
 */
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;


