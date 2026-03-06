import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { getFeaturedProducts } from '../../data/products';
import { ProductCard } from '../ui/ProductCard';
export function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts().slice(0, 8);
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
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
              Featured Products
            </h2>
            <p className="text-text-secondary">
              Handpicked selection of our best-selling tech
            </p>
          </div>
          <Link
            to="/shop?featured=true"
            className="group flex items-center gap-2 text-primary hover:text-primary-light font-medium transition-colors">

            View All
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) =>
          <ProductCard key={product.id} product={product} index={index} />
          )}
        </div>
      </div>
    </section>);

}