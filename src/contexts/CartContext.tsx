import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Dish } from '@/types';
import { cartService } from '@/services';
import { STORAGE_KEYS } from '@/lib/constants';
import { getErrorMessage } from '@/lib/errorHandler';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (dish: Dish, quantity?: number) => Promise<void>;
  removeFromCart: (dishId: string) => Promise<void>;
  updateQuantity: (dishId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from API or localStorage
  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      // Load from localStorage for unauthenticated users
      try {
        const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
        if (storedCart) {
          const cartItems: CartItem[] = JSON.parse(storedCart);
          // Validate cart items structure
          const validItems = cartItems.filter(
            (item) => item && item.dish && item.dish.id && typeof item.quantity === 'number'
          );
          setItems(validItems);
        }
      } catch (error) {
        console.error('Failed to load cart from storage:', error);
        setItems([]);
      }
      return;
    }

    // Load from API for authenticated users
    setIsLoading(true);
    try {
      const cart = await cartService.getCart();
      // Validate cart items structure and filter out invalid items
      const validItems = (cart.items || []).filter(
        (item) => item && item.dish && item.dish.id && typeof item.quantity === 'number' && item.dish.price !== undefined
      );
      setItems(validItems);
      // Sync to localStorage as backup
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(validItems));
    } catch (error) {
      console.error('Failed to load cart:', error);
      // On error, try to load from localStorage as fallback
      try {
        const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
        if (storedCart) {
          const cartItems: CartItem[] = JSON.parse(storedCart);
          const validItems = cartItems.filter(
            (item) => item && item.dish && item.dish.id && typeof item.quantity === 'number'
          );
          setItems(validItems);
        } else {
          setItems([]);
        }
      } catch (storageError) {
        console.error('Failed to load cart from storage fallback:', storageError);
        setItems([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load cart on mount and when auth state changes
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const syncToBackend = useCallback(async (newItems: CartItem[]) => {
    if (!isAuthenticated) {
      // Store in localStorage only
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(newItems));
      return;
    }

    // Sync to backend
    try {
      const itemsToSync = newItems.map((item) => ({
        dishId: item.dish.id,
        quantity: item.quantity,
      }));
      const cart = await cartService.updateCart(itemsToSync);
      setItems(cart.items);
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart.items));
    } catch (error: unknown) {
      console.error('Failed to sync cart:', error);
      // Revert to previous state on error
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(async (dish: Dish, quantity: number = 1) => {
    const existingItemIndex = items.findIndex((item) => item.dish.id === dish.id);
    let newItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      newItems = items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new item
      newItems = [...items, { dish, quantity }];
    }

    setItems(newItems);
    await syncToBackend(newItems);
  }, [items, syncToBackend]);

  const removeFromCart = useCallback(async (dishId: string) => {
    const newItems = items.filter((item) => item.dish.id !== dishId);
    setItems(newItems);
    await syncToBackend(newItems);
  }, [items, syncToBackend]);

  const updateQuantity = useCallback(async (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(dishId);
      return;
    }

    const newItems = items.map((item) =>
      item.dish.id === dishId ? { ...item, quantity } : item
    );
    setItems(newItems);
    await syncToBackend(newItems);
  }, [items, syncToBackend, removeFromCart]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (error: unknown) {
        console.error('Failed to clear cart:', error);
        // Still clear locally even if API call fails
      }
    }
    setItems([]);
    localStorage.removeItem(STORAGE_KEYS.CART);
  }, [isAuthenticated]);

  const totalItems = items.reduce((sum, item) => {
    if (!item || typeof item.quantity !== 'number') return sum;
    return sum + item.quantity;
  }, 0);
  
  const totalPrice = items.reduce((sum, item) => {
    if (!item || !item.dish || typeof item.dish.price !== 'number' || typeof item.quantity !== 'number') return sum;
    return sum + item.dish.price * item.quantity;
  }, 0);

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

