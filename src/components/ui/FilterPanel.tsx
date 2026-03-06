import React from 'react';
import { XIcon, FilterIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../../data/categories';
import { FilterState } from '../../types';
interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}
const brands = [
'ORIONX',
'NVIDIA',
'AMD',
'Intel',
'ASUS',
'Corsair',
'Logitech',
'Razer',
'Samsung',
'Apple',
'Dell',
'LG',
'G.Skill',
'Western Digital',
'Seagate',
'SteelSeries',
'Elgato',
'NZXT'];

export function FilterPanel({
  filters,
  onFilterChange,
  isOpen,
  onClose,
  isMobile = false
}: FilterPanelProps) {
  const handleCategoryChange = (categorySlug: string) => {
    const newCategories = filters.categories.includes(categorySlug) ?
    filters.categories.filter((c) => c !== categorySlug) :
    [...filters.categories, categorySlug];
    onFilterChange({
      ...filters,
      categories: newCategories
    });
  };
  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brands.includes(brand) ?
    filters.brands.filter((b) => b !== brand) :
    [...filters.brands, brand];
    onFilterChange({
      ...filters,
      brands: newBrands
    });
  };
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue =
    value === '' ? type === 'min' ? 0 : 10000 : parseInt(value, 10);
    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: numValue
      }
    });
  };
  const handleRatingChange = (rating: number | null) => {
    onFilterChange({
      ...filters,
      rating
    });
  };
  const handleInStockChange = () => {
    onFilterChange({
      ...filters,
      inStockOnly: !filters.inStockOnly
    });
  };
  const clearFilters = () => {
    onFilterChange({
      categories: [],
      priceRange: {
        min: 0,
        max: 10000
      },
      brands: [],
      rating: null,
      inStockOnly: false,
      sortBy: 'featured'
    });
  };
  const hasActiveFilters =
  filters.categories.length > 0 ||
  filters.brands.length > 0 ||
  filters.rating !== null ||
  filters.inStockOnly ||
  filters.priceRange.min > 0 ||
  filters.priceRange.max < 10000;
  const filterContent =
  <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilterIcon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
        </div>
        {hasActiveFilters &&
      <button
        onClick={clearFilters}
        className="text-sm text-primary hover:text-primary-light transition-colors">

            Clear All
          </button>
      }
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">
          Categories
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) =>
        <label
          key={category.id}
          className="flex items-center gap-3 cursor-pointer group">

              <input
            type="checkbox"
            checked={filters.categories.includes(category.slug)}
            onChange={() => handleCategoryChange(category.slug)}
            className="w-4 h-4 rounded border-border bg-surface text-primary focus:ring-primary focus:ring-offset-0" />

              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                {category.name}
              </span>
              <span className="text-xs text-text-muted ml-auto">
                ({category.productCount})
              </span>
            </label>
        )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">
          Price Range
        </h4>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
            type="number"
            placeholder="Min"
            value={filters.priceRange.min || ''}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary" />

          </div>
          <span className="text-text-muted">-</span>
          <div className="flex-1">
            <input
            type="number"
            placeholder="Max"
            value={
            filters.priceRange.max === 10000 ? '' : filters.priceRange.max
            }
            onChange={(e) => handlePriceChange('max', e.target.value)}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary" />

          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Brands</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) =>
        <label
          key={brand}
          className="flex items-center gap-3 cursor-pointer group">

              <input
            type="checkbox"
            checked={filters.brands.includes(brand)}
            onChange={() => handleBrandChange(brand)}
            className="w-4 h-4 rounded border-border bg-surface text-primary focus:ring-primary focus:ring-offset-0" />

              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                {brand}
              </span>
            </label>
        )}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) =>
        <label
          key={rating}
          className="flex items-center gap-3 cursor-pointer group">

              <input
            type="radio"
            name="rating"
            checked={filters.rating === rating}
            onChange={() => handleRatingChange(rating)}
            className="w-4 h-4 border-border bg-surface text-primary focus:ring-primary focus:ring-offset-0" />

              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                {rating}+ Stars
              </span>
            </label>
        )}
          {filters.rating &&
        <button
          onClick={() => handleRatingChange(null)}
          className="text-xs text-primary hover:text-primary-light transition-colors">

              Clear rating filter
            </button>
        }
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={handleInStockChange}
          className="w-4 h-4 rounded border-border bg-surface text-primary focus:ring-primary focus:ring-offset-0" />

          <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
            In Stock Only
          </span>
        </label>
      </div>
    </div>;

  // Mobile drawer
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen &&
        <>
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose} />

            <motion.div
            initial={{
              x: '-100%'
            }}
            animate={{
              x: 0
            }}
            exit={{
              x: '-100%'
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-background border-r border-border z-50 overflow-y-auto">

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-text-primary">
                    Filters
                  </h2>
                  <button
                  onClick={onClose}
                  className="p-2 text-text-secondary hover:text-text-primary transition-colors">

                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
                {filterContent}
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>);

  }
  // Desktop sidebar
  return (
    <div className="w-64 flex-shrink-0">
      <div className="sticky top-24 bg-surface/50 border border-border rounded-xl p-6">
        {filterContent}
      </div>
    </div>);

}