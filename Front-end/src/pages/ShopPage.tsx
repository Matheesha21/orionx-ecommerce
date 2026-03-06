import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GridIcon, ListIcon, FilterIcon, ChevronDownIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';
import { FilterState, Product } from '../types';
import { ProductCard } from '../components/ui/ProductCard';
import { FilterPanel } from '../components/ui/FilterPanel';
import { Breadcrumb } from '../components/ui/Breadcrumb';
const sortOptions = [
{
  value: 'featured',
  label: 'Featured'
},
{
  value: 'price-asc',
  label: 'Price: Low to High'
},
{
  value: 'price-desc',
  label: 'Price: High to Low'
},
{
  value: 'rating',
  label: 'Highest Rated'
},
{
  value: 'newest',
  label: 'Newest'
}];

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const initialFilters: FilterState = {
    categories: searchParams.get('category') ?
    [searchParams.get('category')!] :
    [],
    priceRange: {
      min: 0,
      max: 10000
    },
    brands: [],
    rating: null,
    inStockOnly: false,
    sortBy: 'featured'
  };
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const searchQuery = searchParams.get('search') || '';
  // Update filters when URL params change
  useEffect(() => {
    const category = searchParams.get('category');
    if (category && !filters.categories.includes(category)) {
      setFilters((prev) => ({
        ...prev,
        categories: [category]
      }));
    }
  }, [searchParams]);
  const filteredProducts = useMemo(() => {
    let result = [...products];
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }
    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }
    // Price filter
    result = result.filter(
      (p) =>
      p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
    );
    // Rating filter
    if (filters.rating) {
      result = result.filter((p) => p.rating >= filters.rating!);
    }
    // In stock filter
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort(
          (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return result;
  }, [filters, searchQuery]);
  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    setFilters((prev) => ({
      ...prev,
      sortBy
    }));
    setIsSortOpen(false);
  };
  const breadcrumbItems = [
  {
    label: 'Shop'
  },
  ...(filters.categories.length === 1 ?
  [
  {
    label:
    filters.categories[0].charAt(0).toUpperCase() +
    filters.categories[0].slice(1)
  }] :

  [])];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              {searchQuery ? `Search: "${searchQuery}"` : 'All Products'}
            </h1>
            <p className="text-text-secondary mt-1">
              {filteredProducts.length} products found
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-text-secondary hover:text-text-primary transition-colors">

              <FilterIcon className="w-4 h-4" />
              Filters
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-text-secondary hover:text-text-primary transition-colors">

                <span className="text-sm">
                  {sortOptions.find((o) => o.value === filters.sortBy)?.label}
                </span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {isSortOpen &&
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  exit={{
                    opacity: 0,
                    y: -10
                  }}
                  className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-20">

                    {sortOptions.map((option) =>
                  <button
                    key={option.value}
                    onClick={() =>
                    handleSortChange(
                      option.value as FilterState['sortBy']
                    )
                    }
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${filters.sortBy === option.value ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'}`}>

                        {option.label}
                      </button>
                  )}
                  </motion.div>
                }
              </AnimatePresence>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'}`}
                aria-label="Grid view">

                <GridIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'}`}
                aria-label="List view">

                <ListIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              isOpen={true}
              onClose={() => {}} />

          </div>

          {/* Mobile Filter Drawer */}
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            isMobile />


          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ?
            <div className="text-center py-16">
                <p className="text-text-secondary text-lg mb-4">
                  No products found matching your criteria
                </p>
                <button
                onClick={() =>
                setFilters({
                  categories: [],
                  priceRange: {
                    min: 0,
                    max: 10000
                  },
                  brands: [],
                  rating: null,
                  inStockOnly: false,
                  sortBy: 'featured'
                })
                }
                className="text-primary hover:text-primary-light transition-colors">

                  Clear all filters
                </button>
              </div> :

            <div
              className={
              viewMode === 'grid' ?
              'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' :
              'space-y-4'
              }>

                {filteredProducts.map((product, index) =>
              <ProductCard
                key={product.id}
                product={product}
                index={index} />

              )}
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}