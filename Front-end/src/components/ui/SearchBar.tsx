import React, { useEffect, useState, useRef, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchProducts } from '../../data/products';
import { Product } from '../../types';
interface SearchBarProps {
  className?: string;
  onClose?: () => void;
  isMobile?: boolean;
}
export function SearchBar({
  className = '',
  onClose,
  isMobile = false
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node))
      {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim().length >= 2) {
        const searchResults = searchProducts(query).slice(0, 5);
        setResults(searchResults);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
      onClose?.();
    }
  };
  const handleResultClick = (product: Product) => {
    navigate(`/product/${product.slug}`);
    setIsOpen(false);
    setQuery('');
    onClose?.();
  };
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className={`w-full pl-10 pr-10 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${isMobile ? 'text-base' : 'text-sm'}`} />

          {query &&
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">

              <XIcon className="w-4 h-4" />
            </button>
          }
        </div>
      </form>

      <AnimatePresence>
        {isOpen && results.length > 0 &&
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
          transition={{
            duration: 0.2
          }}
          className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-50">

            <ul className="divide-y divide-border">
              {results.map((product) =>
            <li key={product.id}>
                  <button
                onClick={() => handleResultClick(product)}
                className="w-full flex items-center gap-3 p-3 hover:bg-surface-elevated transition-colors text-left">

                    <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg" />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {product.brand} • ${product.price}
                      </p>
                    </div>
                  </button>
                </li>
            )}
            </ul>
            <button
            onClick={handleSubmit}
            className="w-full p-3 text-sm text-primary hover:bg-surface-elevated transition-colors border-t border-border">

              View all results for "{query}"
            </button>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}