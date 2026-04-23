import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GridIcon, ListIcon, SearchIcon, RefreshCwIcon } from "lucide-react";
import { Product } from "../types";
import { ProductCard } from "../components/ui/ProductCard";
import { productsApi } from "../services/productService";

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface/50 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-surface-elevated" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-surface-elevated rounded w-1/3" />
        <div className="h-5 bg-surface-elevated rounded w-3/4" />
        <div className="h-4 bg-surface-elevated rounded w-full" />
        <div className="h-4 bg-surface-elevated rounded w-2/3" />
        <div className="h-6 bg-surface-elevated rounded w-1/3" />
      </div>
    </div>
  );
}

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await productsApi.getAll({
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        sort: sortBy || undefined,
      });

      const mappedProducts = (response.data || []).map((p: any) => ({
        ...p,
        id: p.id || p._id,
      }));

      setProducts(mappedProducts);
    } catch (error: any) {
      console.error("Failed to load products:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params: Record<string, string> = {};

    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (sortBy && sortBy !== "newest") params.sort = sortBy;

    setSearchParams(params);
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy]);

  const displayedProducts = useMemo(() => products, [products]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">All Products</h1>
            <p className="text-text-secondary mt-2">
              Browse the latest products from ORIONX.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface/50 p-4 md:p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-text-primary"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl border border-border bg-background text-text-primary"
              >
                <option value="">All Categories</option>
                <option value="Laptops">Laptops</option>
                <option value="Storage">Storage</option>
                <option value="Accessories">Accessories</option>
                <option value="Monitors">Monitors</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border border-border bg-background text-text-primary"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A-Z</option>
                <option value="name_desc">Name: Z-A</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-text-secondary">
              {loading ? "Loading products..." : `${displayedProducts.length} product(s) found`}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg border transition ${
                  viewMode === "grid"
                    ? "bg-primary text-white border-primary"
                    : "border-border text-text-secondary"
                }`}
              >
                <GridIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg border transition ${
                  viewMode === "list"
                    ? "bg-primary text-white border-primary"
                    : "border-border text-text-secondary"
                }`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                : "grid grid-cols-1 gap-6"
            }
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <p className="text-red-400 text-lg font-medium mb-3">
              Failed to load products
            </p>
            <p className="text-text-secondary mb-5">{error}</p>
            <button
              onClick={fetchProducts}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition"
            >
              <RefreshCwIcon className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && displayedProducts.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface/50 p-10 text-center">
            <p className="text-xl font-semibold text-text-primary mb-2">
              No products found
            </p>
            <p className="text-text-secondary mb-5">
              Try changing your search term, category, or sorting option.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSortBy("newest");
              }}
              className="px-5 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && displayedProducts.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                : "grid grid-cols-1 gap-6"
            }
          >
            {displayedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}