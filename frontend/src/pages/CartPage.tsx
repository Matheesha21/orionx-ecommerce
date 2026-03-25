import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  TrashIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { QuantitySelector } from "../components/ui/QuantitySelector";
import { PriceDisplay } from "../components/ui/PriceDisplay";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { userApi } from "../services/userService";

interface CartProduct {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  stockCount: number;
  images: string[];
}

interface CartItem {
  product: CartProduct;
  quantity: number;
}

export function CartPage() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
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
    } catch (error: any) {
      console.error("Failed to load cart:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleRemove = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await userApi.removeFromCart(productId, token);
      await fetchCart();
    } catch (error: any) {
      console.error("Failed to remove cart item:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to remove cart item");
    }
  };

  const handleQuantityChange = async (productId: string, qty: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await userApi.updateCartItem(productId, qty, token);
      await fetchCart();
    } catch (error: any) {
      console.error("Failed to update quantity:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  const shipping = subtotal > 100 ? 0 : items.length > 0 ? 15 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading cart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-surface border border-border">
              <ShoppingBagIcon className="w-12 h-12 text-text-muted" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Your cart is empty
            </h1>
            <p className="text-text-secondary mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
            >
              Start Shopping
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            {
              label: "Cart",
            },
          ]}
          className="mb-8"
        />

        <h1 className="text-3xl font-bold text-text-primary mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-4 p-4 bg-surface/50 border border-border rounded-xl"
                >
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-background"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="text-text-primary font-medium hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-text-muted mt-1">
                      {item.product.brand}
                    </p>
                    <PriceDisplay
                      price={item.product.price}
                      originalPrice={item.product.originalPrice}
                      size="sm"
                      className="mt-2"
                    />
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemove(item.product.id || item.product._id)}
                      className="p-2 text-text-muted hover:text-red-400 transition-colors"
                      aria-label="Remove item"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>

                    <QuantitySelector
                      quantity={item.quantity}
                      onQuantityChange={(qty) =>
                        handleQuantityChange(item.product.id || item.product._id, qty)
                      }
                      max={item.product.stockCount}
                      size="sm"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-surface/50 border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-text-primary">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Shipping</span>
                  <span className="text-text-primary">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Tax (8%)</span>
                  <span className="text-text-primary">{formatPrice(tax)}</span>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-text-primary">
                      Total
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                Proceed to Checkout
                <ArrowRightIcon className="w-4 h-4" />
              </Link>

              <p className="text-xs text-text-muted text-center mt-4">
                Free shipping on orders over $100
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}