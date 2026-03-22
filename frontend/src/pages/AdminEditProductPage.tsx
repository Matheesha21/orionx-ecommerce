import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { productsApi } from "../services/productService";

export function AdminEditProductPage() {
  const { id } = useParams();
  const { isAuthenticated, isAdmin } = useAuth();

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productsApi.getAll();
        const product = res.data.find((p: any) => p._id === id);

        if (!product) {
          setError("Product not found");
          return;
        }

        setFormData(product);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await productsApi.update(id!, formData, token);
      setMessage("Product updated successfully");
    } catch (error: any) {
      console.error(error);
      setError("Update failed");
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (!formData) return <div className="p-6 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto bg-surface/50 p-6 rounded-xl border border-border">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

        {message && <p className="text-green-400 mb-3">{message}</p>}
        {error && <p className="text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="stockCount"
            value={formData.stockCount}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <button className="w-full bg-primary text-white py-3 rounded">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}