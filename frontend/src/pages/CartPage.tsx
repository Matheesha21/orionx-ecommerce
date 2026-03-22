import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrashIcon,
  ShoppingBagIcon,
  TagIcon,
  ArrowRightIcon } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { QuantitySelector } from '../components/ui/QuantitySelector';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { Breadcrumb } from '../components/ui/Breadcrumb';
export function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    subtotal,
    discount,
    tax,
    shipping,
    total
  } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const result = applyCoupon(couponCode);
    if (result.success) {
      setCouponSuccess(result.message);
      setCouponCode('');
    } else {
      setCouponError(result.message);
    }
  };
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors">

              Start Shopping
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
            label: 'Cart'
          }]
          }
          className="mb-8" />


        <h1 className="text-3xl font-bold text-text-primary mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) =>
              <motion.div
                key={item.product.id}
                layout
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  x: -100
                }}
                className="flex gap-4 p-4 bg-surface/50 border border-border rounded-xl">

                  <Link
                  to={`/product/${item.product.slug}`}
                  className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-background">

                    <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover" />

                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                    to={`/product/${item.product.slug}`}
                    className="text-text-primary font-medium hover:text-primary transition-colors line-clamp-2">

                      {item.product.name}
                    </Link>
                    <p className="text-sm text-text-muted mt-1">
                      {item.product.brand}
                    </p>
                    <PriceDisplay
                    price={item.product.price}
                    originalPrice={item.product.originalPrice}
                    size="sm"
                    className="mt-2" />

                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-text-muted hover:text-red-400 transition-colors"
                    aria-label="Remove item">

                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <QuantitySelector
                    quantity={item.quantity}
                    onQuantityChange={(qty) =>
                    updateQuantity(item.product.id, qty)
                    }
                    max={item.product.stockCount}
                    size="sm" />

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={clearCart}
              className="text-sm text-text-muted hover:text-red-400 transition-colors">

              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-surface/50 border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">
                Order Summary
              </h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm text-text-secondary mb-2">
                  Coupon Code
                </label>
                {appliedCoupon ?
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TagIcon className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400 font-medium">
                        {appliedCoupon.code}
                      </span>
                    </div>
                    <button
                    onClick={removeCoupon}
                    className="text-xs text-green-400 hover:text-green-300">

                      Remove
                    </button>
                  </div> :

                <div className="flex gap-2">
                    <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>
                    setCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary" />

                    <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-text-primary hover:border-primary transition-colors">

                      Apply
                    </button>
                  </div>
                }
                {couponError &&
                <p className="text-xs text-red-400 mt-2">{couponError}</p>
                }
                {couponSuccess &&
                <p className="text-xs text-green-400 mt-2">{couponSuccess}</p>
                }
                <p className="text-xs text-text-muted mt-2">
                  Try: ORIONX10 or TECH20
                </p>
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-text-primary">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {discount > 0 &&
                <div className="flex justify-between text-sm">
                    <span className="text-green-400">Discount</span>
                    <span className="text-green-400">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                }
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Shipping</span>
                  <span className="text-text-primary">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
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
                className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors">

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
    </div>);

}