import type { OrderStatus } from './index';
import { OrderStatus as OrderStatusValues } from './index';

/**
 * Order status display labels
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatusValues.PLACED]: 'Placed',
  [OrderStatusValues.PREPARING]: 'Preparing',
  [OrderStatusValues.READY]: 'Ready',
  [OrderStatusValues.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [OrderStatusValues.DELIVERED]: 'Delivered',
  [OrderStatusValues.CANCELLED]: 'Cancelled',
};

/**
 * Order status badge variants (for UI components)
 */
export const ORDER_STATUS_VARIANTS: Record<OrderStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  [OrderStatusValues.PLACED]: 'info',
  [OrderStatusValues.PREPARING]: 'warning',
  [OrderStatusValues.READY]: 'info',
  [OrderStatusValues.OUT_FOR_DELIVERY]: 'warning',
  [OrderStatusValues.DELIVERED]: 'success',
  [OrderStatusValues.CANCELLED]: 'danger',
};

/**
 * Default pagination values
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

/**
 * Order status options for select dropdowns
 */
export const ORDER_STATUS_OPTIONS = Object.values(OrderStatusValues).map((status) => ({
  value: status,
  label: ORDER_STATUS_LABELS[status],
}));


