import React from 'react';
import { motion } from 'framer-motion';
import { categories } from '../../data/categories';
import { CategoryCard } from '../ui/CategoryCard';
export function CategoryShowcase() {
  return (
    <section className="py-16 md:py-24 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
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

          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Shop by Category
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Browse our extensive collection of tech products across all
            categories
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) =>
          <CategoryCard key={category.id} category={category} index={index} />
          )}
        </div>
      </div>
    </section>);

}