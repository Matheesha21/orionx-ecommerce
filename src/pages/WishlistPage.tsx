import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  ArrowRightIcon } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { RatingStars } from '../components/ui/RatingStars';
export function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const handleMoveToCart = (productId: string) => {
    const item = items.find((i) => i.product.id === productId);
    if (item) {
      addToCart(item.product);
      removeItem(productId);
    }
  };
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors">

              Explore Products
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>);

  }
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
          {
            label: 'Wishlist'
          }]
          }
          className="mb-8" />


        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            My Wishlist ({items.length})
          </h1>
          <button
            onClick={clearWishlist}
            className="text-sm text-text-muted hover:text-red-400 transition-colors">

            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {items.map((item, index) =>
            <motion.div
              key={item.product.id}
              layout
              initial={{
                opacity: 0,
                scale: 0.9
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{
                opacity: 0,
                scale: 0.9
              }}
              transition={{
                delay: index * 0.05
              }}
              className="bg-surface/50 border border-border rounded-xl overflow-hidden group">

                <Link
                to={`/product/${item.product.slug}`}
                className="block relative aspect-square overflow-hidden bg-background">

                  <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                </Link>

                <div className="p-4">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                    {item.product.brand}
                  </p>
                  <Link
                  to={`/product/${item.product.slug}`}
                  className="text-sm font-medium text-text-primary hover:text-primary transition-colors line-clamp-2 mb-2">

                    {item.product.name}
                  </Link>
                  <RatingStars
                  rating={item.product.rating}
                  size="sm"
                  className="mb-3" />

                  <PriceDisplay
                  price={item.product.price}
                  originalPrice={item.product.originalPrice}
                  size="md"
                  className="mb-4" />


                  <div className="flex gap-2">
                    <button
                    onClick={() => handleMoveToCart(item.product.id)}
                    disabled={!item.product.inStock}
                    className="flex-1 py-2 bg-primary hover:bg-primary-light text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors">

                      <ShoppingCartIcon className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 border border-border rounded-lg text-text-muted hover:text-red-400 hover:border-red-400/50 transition-colors"
                    aria-label="Remove from wishlist">

                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>);

}