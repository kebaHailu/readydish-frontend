import api from '@/lib/api';
import type { Dish, DishData, PaginatedResponse, DishSearchParams } from '@/types';

/**
 * Dish Service
 */

export const dishService = {
  /**
   * Get all dishes with pagination and search
   */
  async getDishes(params?: DishSearchParams): Promise<PaginatedResponse<Dish>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params?.isAvailable !== undefined) queryParams.append('isAvailable', params.isAvailable.toString());

    const queryString = queryParams.toString();
    const url = `/dishes${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<{ success: true; data: { dishes: Dish[]; meta: PaginatedResponse<Dish>['meta'] } }>(url);
    
    return {
      data: response.data.data.dishes,
      meta: response.data.data.meta,
    };
  },

  /**
   * Get dish by ID
   */
  async getDishById(id: string): Promise<Dish> {
    const response = await api.get<{ success: true; data: { dish: Dish } }>(`/dishes/${id}`);
    return response.data.data.dish;
  },

  /**
   * Create a new dish (Admin only)
   */
  async createDish(data: DishData): Promise<Dish> {
    const response = await api.post<{ success: true; data: { dish: Dish } }>('/admin/dishes', data);
    return response.data.data.dish;
  },

  /**
   * Update a dish (Admin only)
   */
  async updateDish(id: string, data: DishData): Promise<Dish> {
    const response = await api.put<{ success: true; data: { dish: Dish } }>(`/admin/dishes/${id}`, data);
    return response.data.data.dish;
  },

  /**
   * Delete a dish (Admin only)
   */
  async deleteDish(id: string): Promise<void> {
    await api.delete<{ success: true; data: { message: string } }>(`/admin/dishes/${id}`);
  },
};

