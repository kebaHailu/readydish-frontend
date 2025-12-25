import api from '@/lib/api';
import type { Order, PaginatedResponse, CreateOrderData, UpdateOrderStatusData, OrderFilterParams } from '@/types';

/**
 * Order Service
 */

export const orderService = {
  /**
   * Place a new order
   */
  async placeOrder(data: CreateOrderData): Promise<Order> {
    const response = await api.post<{ success: true; data: { order: Order } }>('/orders', data);
    return response.data.data.order;
  },

  /**
   * Get current user's orders
   */
  async getMyOrders(params?: OrderFilterParams): Promise<PaginatedResponse<Order>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const url = `/orders${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<{ success: true; data: { orders: Order[]; meta: PaginatedResponse<Order>['meta'] } }>(url);
    
    return {
      data: response.data.data.orders,
      meta: response.data.data.meta,
    };
  },

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<{ success: true; data: { order: Order } }>(`/orders/${id}`);
    return response.data.data.order;
  },

  /**
   * Get all orders (Admin only)
   */
  async getAllOrders(params?: OrderFilterParams): Promise<PaginatedResponse<Order>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.userId) queryParams.append('userId', params.userId);

    const queryString = queryParams.toString();
    const url = `/admin/orders${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<{ success: true; data: { orders: Order[]; meta: PaginatedResponse<Order>['meta'] } }>(url);
    
    return {
      data: response.data.data.orders,
      meta: response.data.data.meta,
    };
  },

  /**
   * Update order status (Admin only)
   */
  async updateOrderStatus(id: string, data: UpdateOrderStatusData): Promise<Order> {
    const response = await api.put<{ success: true; data: { order: Order; message: string } }>(`/admin/orders/${id}/status`, data);
    return response.data.data.order;
  },
};

