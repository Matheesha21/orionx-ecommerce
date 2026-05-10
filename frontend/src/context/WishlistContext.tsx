import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, WishlistItem } from "../types";
import { userApi } from "../services/userService";

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  toggleItem: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  itemCount: number;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setItems([]);
        return;
      }

      const data = await userApi.getWishlist(token);

      const mapped = (data || []).map((item: any) => ({
        product: {
          ...item.product,
          id: item.product._id,
        },
        addedAt: item.addedAt,
      }));

      setItems(mapped);
    } catch (err) {
      console.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addItem = async (product: Product) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await userApi.addToWishlist(product.id, token);
    await fetchWishlist();
  };

  const removeItem = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await userApi.removeFromWishlist(productId, token);
    await fetchWishlist();
  };

  const toggleItem = async (product: Product) => {
    if (isInWishlist(product.id)) {
      await removeItem(product.id);
    } else {
      await addItem(product);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        clearWishlist,
        itemCount: items.length,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}