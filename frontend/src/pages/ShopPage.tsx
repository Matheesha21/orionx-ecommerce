import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GridIcon, ListIcon } from "lucide-react";
import { FilterState, Product } from "../types";
import { ProductCard } from "../components/ui/ProductCard";
import { productsApi } from "../services/api";
import { useApi } from "../hooks/useApi";

export function ShopPage() {

  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: productsResponse, loading, error } = useApi(() =>
    productsApi.getAll()
  );

  const products: Product[] = useMemo(() => {
    if (!productsResponse?.data) return [];

    return productsResponse.data.map((p: any) => ({
      ...p,
      id: p.id || p._id
    }));
  }, [productsResponse]);

  const filteredProducts = useMemo(() => {
    return [...products];
  }, [products]);

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold mb-6">
          All Products
        </h1>

        {loading && (
          <p className="text-lg text-gray-500">
            Loading products...
          </p>
        )}

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}

          </div>
        )}

      </div>
    </div>
  );
}