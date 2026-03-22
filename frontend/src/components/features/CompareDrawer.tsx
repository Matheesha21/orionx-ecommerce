import React from 'react';
import { Link } from 'react-router-dom';
import { XIcon, GitCompareIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompare } from '../../context/CompareContext';
export function CompareDrawer() {
  const { items, removeItem, clearItems, itemCount } = useCompare();
  if (itemCount === 0) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{
          y: 100,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        exit={{
          y: 100,
          opacity: 0
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300
        }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border shadow-2xl">

        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Items */}
            <div className="flex items-center gap-4 overflow-x-auto">
              <div className="flex items-center gap-2 text-text-secondary flex-shrink-0">
                <GitCompareIcon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">
                  Compare ({itemCount}/4)
                </span>
              </div>

              <div className="flex items-center gap-3">
                {items.map((product) =>
                <div
                  key={product.id}
                  className="relative flex items-center gap-2 px-3 py-2 bg-surface-elevated rounded-lg border border-border">

                    <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded" />

                    <span className="text-sm text-text-primary max-w-[120px] truncate">
                      {product.name}
                    </span>
                    <button
                    onClick={() => removeItem(product.id)}
                    className="p-1 text-text-muted hover:text-red-400 transition-colors"
                    aria-label={`Remove ${product.name} from compare`}>

                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={clearItems}
                className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors">

                Clear All
              </button>
              <Link
                to="/compare"
                className="px-6 py-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors">

                Compare Now
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>);

}