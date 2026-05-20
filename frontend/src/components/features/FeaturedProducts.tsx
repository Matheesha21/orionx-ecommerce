import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPreOrderProducts } from '../../data/products';
import { ProductCard } from '../ui/ProductCard';
import { useEffect, useState } from 'react';
import { productsApi } from '../../services/productService';

export function FeaturedProducts() {
  const [preOrderProducts, setPreOrderProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await productsApi.getAll({ preOrder: true, limit: 8 });
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          // normalize backend _id to id for compatibility with ProductCard and other components
          setPreOrderProducts(res.data.map((p: any) => ({ ...p, id: p.id || p._id })));
          return;
        }
      } catch (err) {
        // ignore and fallback to local data
      } finally {
        setLoading(false);
      }
      // fallback to local static Apple products
      setPreOrderProducts(getPreOrderProducts().slice(0, 8));
    };

    fetch();
  }, []);

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
              Pre-order Products
            </h2>
            <p className="text-text-secondary">
              Reserve the latest high-demand tech before it ships
            </p>
          </div>
          <Link
            to="/shop"
            className="group flex items-center gap-2 text-primary hover:text-primary-light font-medium transition-colors">

            View All
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {preOrderProducts.map((product, index) => (
            <ProductCard key={product._id || product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>);

}