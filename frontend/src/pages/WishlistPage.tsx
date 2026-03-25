import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  ArrowRightIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { PriceDisplay } from "../components/ui/PriceDisplay";
import { RatingStars } from "../components/ui/RatingStars";
import { userApi } from "../services/userService";

export function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        return;
      }

      const response = await userApi.getWishlist(token);

      const mappedItems = (response.wishlist || []).map((product: any) => ({
        ...product,
        id: product.id || product._id,
      }));

      setItems(mappedItems);
    } catch (error: any) {
      console.error("Failed to load wishlist:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleRemove = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await userApi.removeFromWishlist(productId, token);
      await fetchWishlist();
    } catch (error: any) {
      console.error("Failed to remove wishlist item:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to remove wishlist item");
    }
  };

  const handleMoveToCart = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await userApi.addToCart(productId, 1, token);
      await userApi.removeFromWishlist(productId, token);
      await fetchWishlist();
    } catch (error: any) {
      console.error("Failed to move item to cart:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to move item to cart");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading wishlist...
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
              <HeartIcon className="w-12 h-12 text-text-muted" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Your wishlist is empty
            </h1>
            <p className="text-text-secondary mb-8">
              Save items you love by clicking the heart icon on any product.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
            >
              Explore Products
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
              label: "Wishlist",
            },
          ]}
          className="mb-8"
        />

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            My Wishlist ({items.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {items.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-surface/50 border border-border rounded-xl overflow-hidden group"
              >
                <Link
                  to={`/product/${product.slug}`}
                  className="block relative aspect-square overflow-hidden bg-background"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="p-4">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                    {product.brand}
                  </p>
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-sm font-medium text-text-primary hover:text-primary transition-colors line-clamp-2 mb-2"
                  >
                    {product.name}
                  </Link>

                  <RatingStars
                    rating={product.rating}
                    size="sm"
                    className="mb-3"
                  />

                  <PriceDisplay
                    price={product.price}
                    originalPrice={product.originalPrice}
                    size="md"
                    className="mb-4"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMoveToCart(product.id || product._id)}
                      disabled={!product.inStock}
                      className="flex-1 py-2 bg-primary hover:bg-primary-light text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => handleRemove(product.id || product._id)}
                      className="p-2 border border-border rounded-lg text-text-muted hover:text-red-400 hover:border-red-400/50 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}