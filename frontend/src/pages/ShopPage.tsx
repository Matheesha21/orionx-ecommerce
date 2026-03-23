import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GridIcon, ListIcon } from "lucide-react";
import { Product } from "../types";
import { ProductCard } from "../components/ui/ProductCard";
import { productsApi } from "../services/productService";

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
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-6 mb-8">
          <h1 className="text-3xl font-bold">All Products</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-2 px-4 py-3 rounded-lg border border-border bg-background text-text-primary"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-lg border border-border bg-background text-text-primary"
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
              className="px-4 py-3 rounded-lg border border-border bg-background text-text-primary"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-text-secondary">
              {loading ? "Loading..." : `${displayedProducts.length} product(s) found`}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg border ${
                  viewMode === "grid"
                    ? "bg-primary text-white border-primary"
                    : "border-border text-text-secondary"
                }`}
              >
                <GridIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg border ${
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

        {loading && <p className="text-lg text-gray-500">Loading products...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && displayedProducts.length === 0 && (
          <p className="text-text-secondary">No products found.</p>
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