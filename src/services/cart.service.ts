import api from '@/lib/api';
import type { Cart, CartItem } from '@/types';

/**
 * Cart Service
 */

export interface UpdateCartRequest {
  items: Array<{
    dishId: string;
    quantity: number;
  }>;
}

export const cartService = {
  /**
   * Get current user's cart
   */
  async getCart(): Promise<Cart> {
    const response = await api.get<{ success: true; data: { cart: Cart } }>('/cart');
    return response.data.data.cart;
  },

  /**
   * Update cart items (replaces entire cart)
   */
  async updateCart(items: UpdateCartRequest['items']): Promise<Cart> {
    const response = await api.put<{ success: true; data: { cart: Cart } }>('/cart', { items });
    return response.data.data.cart;
  },

  /**
   * Clear cart
   */
  async clearCart(): Promise<void> {
    await api.delete<{ success: true; data: { message: string } }>('/cart');
  },
};

