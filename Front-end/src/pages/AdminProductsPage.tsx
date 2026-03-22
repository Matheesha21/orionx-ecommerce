import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { productsApi } from "../services/productService";

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  stockCount: number;
  images: string[];
}

export function AdminProductsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await productsApi.getAll();
      setProducts(response.data || []);
    } catch (error: any) {
      console.error("Failed to load products:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  const handleDelete = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const confirmed = window.confirm("Are you sure you want to delete this product?");
      if (!confirmed) return;

      await productsApi.delete(productId, token);
      await fetchProducts();
    } catch (error: any) {
      console.error("Delete failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Manage Products</h1>

          <Link
            to="/admin/products/new"
            className="px-4 py-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
          >
            Add Product
          </Link>
        </div>

        {loading ? (
          <div className="text-text-secondary">Loading products...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-text-secondary">No products found.</div>
        ) : (
          <div className="overflow-x-auto bg-surface/50 border border-border rounded-xl">
            <table className="w-full text-left">
              <thead className="border-b border-border bg-surface">
                <tr>
                  <th className="px-4 py-3 text-text-secondary">Image</th>
                  <th className="px-4 py-3 text-text-secondary">Name</th>
                  <th className="px-4 py-3 text-text-secondary">Category</th>
                  <th className="px-4 py-3 text-text-secondary">Brand</th>
                  <th className="px-4 py-3 text-text-secondary">Price</th>
                  <th className="px-4 py-3 text-text-secondary">Stock</th>
                  <th className="px-4 py-3 text-text-secondary text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-border">
                    <td className="px-4 py-3">
                      <img
                        src={product.images?.[0] || "https://via.placeholder.com/60"}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 text-text-primary font-medium">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-text-primary">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 text-text-primary">
                      {product.brand}
                    </td>
                    <td className="px-4 py-3 text-text-primary">
                      ${product.price}
                    </td>
                    <td className="px-4 py-3 text-text-primary">
                      {product.stockCount}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="px-3 py-1 text-xs bg-blue-500/10 text-blue-400 rounded"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-3 py-1 text-xs bg-red-500/10 text-red-400 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}