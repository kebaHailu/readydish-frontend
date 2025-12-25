# TypeScript Types Reference

This directory contains all TypeScript type definitions for the ReadyDish application.

## 📋 Overview

All types are exported from `index.ts`. Import them like this:

```tsx
import { User, Dish, Order, OrderStatus, UserRole } from '@/types';
```

---

## 🔷 Core Types

### Enums

#### `UserRole`
```tsx
enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}
```

#### `OrderStatus`
```tsx
enum OrderStatus {
  PLACED = 'placed',
  PREPARING = 'preparing',
  READY = 'ready',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
```

---

## 👤 User Types

### `User`
Complete user entity with all fields.

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

### `SignupData`
Data required for user registration.

```tsx
interface SignupData {
  name: string;
  email: string;
  password: string;
}
```

### `LoginData`
Data required for user login.

```tsx
interface LoginData {
  email: string;
  password: string;
}
```

### `AuthResponse`
Response from authentication endpoints.

```tsx
interface AuthResponse {
  token: string;
  user: User;
}
```

---

## 🍽️ Dish Types

### `Dish`
Complete dish/menu item entity.

```tsx
interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageURL?: string;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

### `DishData`
Data for creating/updating dishes (admin only).

```tsx
interface DishData {
  name: string;
  description: string;
  price: number;
  imageURL?: string;
  isAvailable?: boolean;
}
```

---

## 🛒 Cart Types

### `CartItem`
Item in the shopping cart.

```tsx
interface CartItem {
  dish: Dish;
  quantity: number;
}
```

### `Cart`
Complete cart structure.

```tsx
interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
```

---

## 📦 Order Types

### `OrderItem`
Item within an order (snapshot of dish at time of order).

```tsx
interface OrderItem {
  dishId: string;
  dishName?: string;
  quantity: number;
  price: number; // Price at time of order
}
```

### `DeliveryAddress`
Delivery address information.

```tsx
interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
}
```

### `Order`
Complete order entity.

```tsx
interface Order {
  id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: DeliveryAddress;
  createdAt: string;
  updatedAt?: string;
}
```

### `CreateOrderData`
Data required to create a new order.

```tsx
interface CreateOrderData {
  items: Array<{
    dishId: string;
    quantity: number;
  }>;
  deliveryAddress: DeliveryAddress;
}
```

---

## 📄 Pagination Types

### `PaginationMeta`
Pagination metadata.

```tsx
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

### `PaginatedResponse<T>`
Generic paginated API response.

```tsx
interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
```

**Usage:**
```tsx
const response: PaginatedResponse<Dish> = await getDishes();
// response.data = Dish[]
// response.meta = PaginationMeta
```

### `PaginationParams`
Query parameters for pagination.

```tsx
interface PaginationParams {
  page?: number;
  limit?: number;
}
```

---

## 🔍 Search & Filter Types

### `DishSearchParams`
Parameters for searching and filtering dishes.

```tsx
interface DishSearchParams extends PaginationParams {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
}
```

### `OrderFilterParams`
Parameters for filtering orders.

```tsx
interface OrderFilterParams extends PaginationParams {
  status?: OrderStatus;
  userId?: string;
}
```

---

## ⚠️ API Response Types

### `ApiResponse<T>`
Generic API response wrapper.

```tsx
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

### `ApiError`
Error response structure.

```tsx
interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}
```

---

## 🔐 Auth Types

### `ForgotPasswordData`
```tsx
interface ForgotPasswordData {
  email: string;
}
```

### `ResetPasswordData`
```tsx
interface ResetPasswordData {
  token: string;
  newPassword: string;
}
```

### `VerifyEmailData`
```tsx
interface VerifyEmailData {
  token: string;
}
```

---

## 📊 Constants

Import constants from `constants.ts`:

```tsx
import { 
  ORDER_STATUS_LABELS, 
  ORDER_STATUS_VARIANTS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  ORDER_STATUS_OPTIONS
} from '@/types/constants';
```

### `ORDER_STATUS_LABELS`
Human-readable labels for order statuses.

### `ORDER_STATUS_VARIANTS`
Badge variant mapping for UI components.

### `ORDER_STATUS_OPTIONS`
Array of status options for select dropdowns.

---

## 💡 Usage Examples

### Example 1: Typing a component prop
```tsx
import { Dish } from '@/types';

interface MenuItemProps {
  dish: Dish;
  onAddToCart: (dish: Dish) => void;
}
```

### Example 2: Typing API responses
```tsx
import { PaginatedResponse, Dish } from '@/types';

const getDishes = async (): Promise<PaginatedResponse<Dish>> => {
  // API call
};
```

### Example 3: Using enums
```tsx
import { OrderStatus, ORDER_STATUS_LABELS } from '@/types';
import { ORDER_STATUS_VARIANTS } from '@/types/constants';

const status = OrderStatus.DELIVERED;
const label = ORDER_STATUS_LABELS[status]; // "Delivered"
const variant = ORDER_STATUS_VARIANTS[status]; // "success"
```

### Example 4: Form data types
```tsx
import { SignupData } from '@/types';

const handleSignup = async (data: SignupData) => {
  // Submit form
};
```

---

## 🎯 Best Practices

1. **Always import types from `@/types`** - Don't create duplicate type definitions
2. **Use enums for constants** - `OrderStatus`, `UserRole` instead of string literals
3. **Use generic types** - `PaginatedResponse<T>` for reusable patterns
4. **Type your API functions** - Return typed responses from service functions
5. **Use optional fields wisely** - `?` for fields that may not always be present

---

## 🔄 Type Updates

When adding new types:
1. Add to `index.ts` with proper JSDoc comments
2. Export from `index.ts`
3. Update this README if it's a major type
4. Use consistent naming conventions (PascalCase for interfaces, UPPER_CASE for constants)


