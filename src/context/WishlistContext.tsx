import React, { useEffect, createContext, useContext, useReducer } from 'react';
import { Product, WishlistItem } from '../types';
interface WishlistState {
  items: WishlistItem[];
}
type WishlistAction =
{
  type: 'ADD_ITEM';
  payload: Product;
} |
{
  type: 'REMOVE_ITEM';
  payload: string;
} |
{
  type: 'CLEAR_WISHLIST';
} |
{
  type: 'LOAD_WISHLIST';
  payload: WishlistItem[];
};
interface WishlistContextType {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  itemCount: number;
}
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);
const wishlistReducer = (
state: WishlistState,
action: WishlistAction)
: WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM':{
        const exists = state.items.some(
          (item) => item.product.id === action.payload.id
        );
        if (exists) return state;
        return {
          items: [
          ...state.items,
          {
            product: action.payload,
            addedAt: new Date().toISOString()
          }]

        };
      }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter((item) => item.product.id !== action.payload)
      };
    case 'CLEAR_WISHLIST':
      return {
        items: []
      };
    case 'LOAD_WISHLIST':
      return {
        items: action.payload
      };
    default:
      return state;
  }
};
const WISHLIST_STORAGE_KEY = 'orionx-wishlist';
export function WishlistProvider({ children }: {children: ReactNode;}) {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: []
  });
  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist);
        dispatch({
          type: 'LOAD_WISHLIST',
          payload: parsed
        });
      } catch (e) {
        console.error('Failed to load wishlist from localStorage');
      }
    }
  }, []);
  // Save wishlist to localStorage on change
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);
  const addItem = (product: Product) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: product
    });
  };
  const removeItem = (productId: string) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: productId
    });
  };
  const toggleItem = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };
  const isInWishlist = (productId: string) => {
    return state.items.some((item) => item.product.id === productId);
  };
  const clearWishlist = () => {
    dispatch({
      type: 'CLEAR_WISHLIST'
    });
  };
  const itemCount = state.items.length;
  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        clearWishlist,
        itemCount
      }}>

      {children}
    </WishlistContext.Provider>);

}
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}