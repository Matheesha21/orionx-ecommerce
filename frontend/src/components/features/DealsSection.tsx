import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { getOnSaleProducts } from '../../data/products';
import { ProductCard } from '../ui/ProductCard';
export function DealsSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const dealProducts = getOnSaleProducts().slice(0, 4);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return {
            ...prev,
            seconds: prev.seconds - 1
          };
        } else if (prev.minutes > 0) {
          return {
            ...prev,
            minutes: prev.minutes - 1,
            seconds: 59
          };
        } else if (prev.hours > 0) {
          return {
            hours: prev.hours - 1,
            minutes: 59,
            seconds: 59
          };
        }
        return {
          hours: 23,
          minutes: 59,
          seconds: 59
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (value: number) => value.toString().padStart(2, '0');
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12"
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.5
          }}>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
              <span className="gradient-text">Hot Deals</span> of the Day
            </h2>
            <p className="text-text-secondary">
              Limited time offers on top tech products
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-text-secondary">
              <ClockIcon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Ends in:</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 flex flex-col items-center justify-center bg-surface border border-border rounded-lg">
                <span className="text-xl font-bold text-primary">
                  {formatTime(timeLeft.hours)}
                </span>
                <span className="text-xs text-text-muted">HRS</span>
              </div>
              <span className="text-2xl font-bold text-text-muted">:</span>
              <div className="w-14 h-14 flex flex-col items-center justify-center bg-surface border border-border rounded-lg">
                <span className="text-xl font-bold text-primary">
                  {formatTime(timeLeft.minutes)}
                </span>
                <span className="text-xs text-text-muted">MIN</span>
              </div>
              <span className="text-2xl font-bold text-text-muted">:</span>
              <div className="w-14 h-14 flex flex-col items-center justify-center bg-surface border border-border rounded-lg">
                <span className="text-xl font-bold text-primary">
                  {formatTime(timeLeft.seconds)}
                </span>
                <span className="text-xs text-text-muted">SEC</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dealProducts.map((product, index) =>
          <ProductCard key={product.id} product={product} index={index} />
          )}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            to="/shop?sale=true"
            className="group inline-flex items-center gap-2 text-primary hover:text-primary-light font-medium transition-colors">

            View All Deals
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>);

}