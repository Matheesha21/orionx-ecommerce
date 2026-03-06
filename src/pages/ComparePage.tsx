import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrashIcon,
  ShoppingCartIcon,
  ArrowRightIcon,
  GitCompareIcon } from
'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { RatingStars } from '../components/ui/RatingStars';
export function ComparePage() {
  const { items, removeItem, clearItems } = useCompare();
  const { addItem: addToCart } = useCart();
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-surface border border-border">
              <GitCompareIcon className="w-12 h-12 text-text-muted" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Compare List is Empty
            </h1>
            <p className="text-text-secondary mb-8">
              Add products to compare their specifications side by side.
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
  // Get all unique spec keys across all compared products
  const allSpecKeys = Array.from(
    new Set(items.flatMap((item) => Object.keys(item.specs)))
  ).sort();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
          {
            label: 'Compare'
          }]
          }
          className="mb-8" />


        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Compare Products
          </h1>
          <button
            onClick={clearItems}
            className="text-sm text-text-muted hover:text-red-400 transition-colors">

            Clear All
          </button>
        </div>

        <div className="overflow-x-auto pb-8">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="w-48 p-4 text-left border-b border-border bg-surface/50">
                  <span className="text-sm font-medium text-text-secondary">
                    Product
                  </span>
                </th>
                {items.map((product) =>
                <th
                  key={product.id}
                  className="p-4 border-b border-border bg-surface/50 min-w-[250px] align-top">

                    <div className="relative">
                      <button
                      onClick={() => removeItem(product.id)}
                      className="absolute -top-2 -right-2 p-1.5 bg-surface border border-border rounded-full text-text-muted hover:text-red-400 transition-colors"
                      aria-label="Remove from compare">

                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <Link
                      to={`/product/${product.slug}`}
                      className="block group">

                        <div className="aspect-square rounded-lg overflow-hidden bg-background mb-4 border border-border group-hover:border-primary/50 transition-colors">
                          <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover" />

                        </div>
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                          {product.brand}
                        </p>
                        <h3 className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                      </Link>
                      <RatingStars
                      rating={product.rating}
                      size="sm"
                      className="mb-3" />

                      <PriceDisplay
                      price={product.price}
                      originalPrice={product.originalPrice}
                      size="md"
                      className="mb-4" />

                      <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="w-full py-2 bg-primary hover:bg-primary-light text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 transition-colors">

                        <ShoppingCartIcon className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {/* Basic Info */}
              <tr>
                <td className="p-4 border-b border-border font-medium text-text-primary bg-surface/30">
                  Category
                </td>
                {items.map((product) =>
                <td
                  key={product.id}
                  className="p-4 border-b border-border text-sm text-text-secondary bg-surface/30">

                    {product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)}
                  </td>
                )}
              </tr>
              <tr>
                <td className="p-4 border-b border-border font-medium text-text-primary">
                  Availability
                </td>
                {items.map((product) =>
                <td
                  key={product.id}
                  className="p-4 border-b border-border text-sm">

                    {product.inStock ?
                  <span className="text-green-400">In Stock</span> :

                  <span className="text-red-400">Out of Stock</span>
                  }
                  </td>
                )}
              </tr>

              {/* Specs */}
              {allSpecKeys.map((specKey, index) =>
              <tr key={specKey}>
                  <td
                  className={`p-4 border-b border-border font-medium text-text-primary ${index % 2 === 0 ? 'bg-surface/30' : ''}`}>

                    {specKey}
                  </td>
                  {items.map((product) => {
                  const value = product.specs[specKey];
                  // Check if this value is different from others to highlight it
                  const isDifferent = items.some(
                    (p) => p.specs[specKey] !== value
                  );
                  return (
                    <td
                      key={`${product.id}-${specKey}`}
                      className={`p-4 border-b border-border text-sm ${index % 2 === 0 ? 'bg-surface/30' : ''} ${isDifferent && value ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>

                        {value || '-'}
                      </td>);

                })}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}