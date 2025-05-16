import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/api';
import type { CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = async () => {
    try {
      const cartItems = await cartService.getCart();
      setItems(cartItems);
      setError(null);
    } catch (err) {
      setError('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: number, quantity: number) => {
    try {
      await cartService.addToCart(productId, quantity);
      await refreshCart();
    } catch (err) {
      setError('Failed to add item to cart');
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      if (quantity === 0) {
        await cartService.removeFromCart(itemId);
      } else {
        await cartService.updateCartItem(itemId, quantity);
      }
      await refreshCart();
    } catch (err) {
      setError('Failed to update cart');
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await cartService.removeFromCart(itemId);
      await refreshCart();
    } catch (err) {
      setError('Failed to remove item from cart');
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}