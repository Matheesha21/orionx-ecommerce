import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, CartItem } from "../types";
import { userApi } from "../services/userService";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setItems([]);
        return;
      }

      const response = await userApi.getCart(token);

      const mappedItems = (response.cart || [])
        .filter((item: any) => item.product)
        .map((item: any) => ({
          product: {
            ...item.product,
            id: item.product.id || item.product._id,
          },
          quantity: item.quantity,
        }));

      setItems(mappedItems);
    } catch (error) {
      console.error("Failed to load cart");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (product: Product, quantity = 1) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await userApi.addToCart(product.id, quantity, token);
    await fetchCart();
  };

  const removeItem = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await userApi.removeFromCart(productId, token);
    await fetchCart();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    await userApi.updateCartItem(productId, quantity, token);
    await fetchCart();
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discount = 0;
  const shipping = subtotal > 0 ? 0 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        itemCount,
        subtotal,
        shipping,
        tax,
        discount,
        total,
        loading,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}