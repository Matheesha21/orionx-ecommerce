import React, { useEffect, createContext, useContext, useReducer } from 'react';
import { Product, CartItem, CouponCode } from '../types';
import { validateCoupon } from '../data/products';
interface CartState {
  items: CartItem[];
  appliedCoupon: CouponCode | null;
}
type CartAction =
{
  type: 'ADD_ITEM';
  payload: Product;
} |
{
  type: 'REMOVE_ITEM';
  payload: string;
} |
{
  type: 'UPDATE_QUANTITY';
  payload: {
    productId: string;
    quantity: number;
  };
} |
{
  type: 'CLEAR_CART';
} |
{
  type: 'APPLY_COUPON';
  payload: CouponCode;
} |
{
  type: 'REMOVE_COUPON';
} |
{
  type: 'LOAD_CART';
  payload: CartState;
};
interface CartContextType {
  items: CartItem[];
  appliedCoupon: CouponCode | null;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => {
    success: boolean;
    message: string;
  };
  removeCoupon: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}
const CartContext = createContext<CartContextType | undefined>(undefined);
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':{
        const existingItem = state.items.find(
          (item) => item.product.id === action.payload.id
        );
        if (existingItem) {
          return {
            ...state,
            items: state.items.map((item) =>
            item.product.id === action.payload.id ?
            {
              ...item,
              quantity: item.quantity + 1
            } :
            item
            )
          };
        }
        return {
          ...state,
          items: [
          ...state.items,
          {
            product: action.payload,
            quantity: 1
          }]

        };
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product.id !== action.payload.productId
          )
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
        item.product.id === action.payload.productId ?
        {
          ...item,
          quantity: action.payload.quantity
        } :
        item
        )
      };
    case 'CLEAR_CART':
      return {
        items: [],
        appliedCoupon: null
      };
    case 'APPLY_COUPON':
      return {
        ...state,
        appliedCoupon: action.payload
      };
    case 'REMOVE_COUPON':
      return {
        ...state,
        appliedCoupon: null
      };
    case 'LOAD_CART':
      return action.payload;
    default:
      return state;
  }
};
const CART_STORAGE_KEY = 'orionx-cart';
export function CartProvider({ children }: {children: ReactNode;}) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    appliedCoupon: null
  });
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        dispatch({
          type: 'LOAD_CART',
          payload: parsed
        });
      } catch (e) {
        console.error('Failed to load cart from localStorage');
      }
    }
  }, []);
  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);
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
  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: {
        productId,
        quantity
      }
    });
  };
  const clearCart = () => {
    dispatch({
      type: 'CLEAR_CART'
    });
  };
  const applyCoupon = (
  code: string)
  : {
    success: boolean;
    message: string;
  } => {
    const coupon = validateCoupon(code);
    if (!coupon) {
      return {
        success: false,
        message: 'Invalid coupon code'
      };
    }
    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return {
        success: false,
        message: `Minimum purchase of $${coupon.minPurchase} required`
      };
    }
    dispatch({
      type: 'APPLY_COUPON',
      payload: coupon
    });
    return {
      success: true,
      message: 'Coupon applied successfully!'
    };
  };
  const removeCoupon = () => {
    dispatch({
      type: 'REMOVE_COUPON'
    });
  };
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discount = state.appliedCoupon ?
  state.appliedCoupon.discountType === 'percentage' ?
  Math.min(
    subtotal * state.appliedCoupon.discountValue / 100,
    state.appliedCoupon.maxDiscount || Infinity
  ) :
  state.appliedCoupon.discountValue :
  0;
  const TAX_RATE = 0.08;
  const FREE_SHIPPING_THRESHOLD = 100;
  const SHIPPING_COST = 9.99;
  const tax = (subtotal - discount) * TAX_RATE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal - discount + tax + shipping;
  return (
    <CartContext.Provider
      value={{
        items: state.items,
        appliedCoupon: state.appliedCoupon,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        itemCount,
        subtotal,
        discount,
        tax,
        shipping,
        total
      }}>

      {children}
    </CartContext.Provider>);

}
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}