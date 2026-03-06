import React, { useState, createContext, useContext } from 'react';
import { Product } from '../types';
interface CompareContextType {
  items: Product[];
  addItem: (product: Product) => boolean;
  removeItem: (productId: string) => void;
  clearItems: () => void;
  isInCompare: (productId: string) => boolean;
  canAdd: boolean;
  itemCount: number;
}
const CompareContext = createContext<CompareContextType | undefined>(undefined);
const MAX_COMPARE_ITEMS = 4;
export function CompareProvider({ children }: {children: ReactNode;}) {
  const [items, setItems] = useState<Product[]>([]);
  const addItem = (product: Product): boolean => {
    if (items.length >= MAX_COMPARE_ITEMS) {
      return false;
    }
    if (items.some((item) => item.id === product.id)) {
      return false;
    }
    setItems([...items, product]);
    return true;
  };
  const removeItem = (productId: string) => {
    setItems(items.filter((item) => item.id !== productId));
  };
  const clearItems = () => {
    setItems([]);
  };
  const isInCompare = (productId: string) => {
    return items.some((item) => item.id === productId);
  };
  const canAdd = items.length < MAX_COMPARE_ITEMS;
  const itemCount = items.length;
  return (
    <CompareContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearItems,
        isInCompare,
        canAdd,
        itemCount
      }}>

      {children}
    </CompareContext.Provider>);

}
export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}