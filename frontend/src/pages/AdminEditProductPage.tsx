import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { productsApi } from "../services/productService";

export function AdminEditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const [formData, setFormData] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await productsApi.getAll({ limit: 100 });
        const product = res.data.find((p: any) => p._id === id);

        if (!product) {
          setError("Product not found");
          return;
        }

        setFormData({
          ...product,
          images: product.images || [],
        });
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async () => {
    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!imageFile) {
        setError("Please select an image first");
        return;
      }

      setUploadingImage(true);

      const uploadResult = await productsApi.uploadImage(imageFile, token);

      const imageUrl =
        uploadResult.imageUrl ||
        uploadResult.url ||
        uploadResult.secure_url;

      if (!imageUrl) {
        setError("Image upload failed. No image URL returned.");
        return;
      }

      setFormData((prev: any) => ({
        ...prev,
        images: [imageUrl],
      }));

      setMessage("Image uploaded successfully");
    } catch (err: any) {
      console.error("Image upload failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");
      setUpdating(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const updatePayload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice
          ? Number(formData.originalPrice)
          : null,
        stockCount: Number(formData.stockCount),
        discountPercentage: formData.discountPercentage
          ? Number(formData.discountPercentage)
          : null,
      };

      await productsApi.update(id!, updatePayload, token);

      setMessage("Product updated successfully");
    } catch (err: any) {
      console.error("Update failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
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
          <div>
            <label className="block text-sm mb-2">Product Name</label>
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-background"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Price</label>
            <input
              name="price"
              type="number"
              value={formData.price || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-background"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Original Price</label>
            <input
              name="originalPrice"
              type="number"
              value={formData.originalPrice || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-background"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Category</label>
            <input
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-background"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Brand</label>
            <input
              name="brand"
              value={formData.brand || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-background"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Stock Count</label>
            <input
              name="stockCount"
              type="number"
              value={formData.stockCount || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-background"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Short Description</label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-background"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-background"
            />
          </div>

          <div className="border border-border rounded-lg p-4">
            <label className="block text-sm mb-3">Product Image</label>

            {formData.images?.[0] && (
              <img
                src={formData.images[0]}
                alt={formData.name}
                className="w-32 h-32 object-cover rounded-lg mb-4"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full mb-3"
            />

            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploadingImage}
              className="px-4 py-2 bg-surface border border-border rounded text-sm disabled:opacity-50"
            >
              {uploadingImage ? "Uploading..." : "Upload / Replace Image"}
            </button>
          </div>

          <button
            disabled={updating}
            className="w-full bg-primary text-white py-3 rounded disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}