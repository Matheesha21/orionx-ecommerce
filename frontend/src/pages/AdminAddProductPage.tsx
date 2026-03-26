import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { productsApi } from "../services/productService";

export function AdminAddProductPage() {
  const { isAuthenticated, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    subcategory: "",
    brand: "",
    price: "",
    originalPrice: "",
    description: "",
    shortDescription: "",
    stockCount: "",
    isFeatured: false,
    isOnSale: false,
    discountPercentage: "",
    tags: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async () => {
    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        return;
      }

      if (!imageFile) {
        setError("Please choose an image first");
        return;
      }

      setUploadingImage(true);

      const result = await productsApi.uploadImage(imageFile, token);
      setUploadedImageUrl(result.imageUrl);
      setMessage("Image uploaded successfully");
    } catch (error: any) {
      console.error("Image upload failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        return;
      }

      if (!uploadedImageUrl) {
        setError("Please upload an image first");
        return;
      }

      if (
        !formData.name.trim() ||
        !formData.slug.trim() ||
        !formData.category.trim() ||
        !formData.brand.trim() ||
        !formData.price ||
        !formData.description.trim() ||
        !formData.shortDescription.trim() ||
        !formData.stockCount
      ) {
        setError("Please fill all required fields, including short description");
        return;
      }

      setCreatingProduct(true);

      const productData = {
        name: formData.name.trim(),
        slug: formData.slug.trim().toLowerCase(),
        category: formData.category.trim(),
        subcategory: formData.subcategory.trim(),
        brand: formData.brand.trim(),
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || 0),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        specs: {},
        images: [uploadedImageUrl],
        stockCount: Number(formData.stockCount),
        isFeatured: formData.isFeatured,
        isOnSale: formData.isOnSale,
        discountPercentage: Number(formData.discountPercentage || 0),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      console.log("SENDING PRODUCT DATA:", productData);

      const result = await productsApi.create(productData, token);

      console.log("CREATE PRODUCT RESPONSE:", result);

      setMessage("Product created successfully");
      setFormData({
        name: "",
        slug: "",
        category: "",
        subcategory: "",
        brand: "ORIONX",
        price: "",
        originalPrice: "",
        description: "",
        shortDescription: "",
        stockCount: "",
        isFeatured: false,
        isOnSale: false,
        discountPercentage: "",
        tags: "",
      });
      setImageFile(null);
      setUploadedImageUrl("");
    } catch (error: any) {
      console.error("Create product failed:", error.response?.data || error.message);
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create product"
      );
    } finally {
      setCreatingProduct(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-3xl mx-auto bg-surface/50 border border-border rounded-xl p-6">
        <h1 className="text-3xl font-bold text-text-primary mb-8">
          Add Product
        </h1>

        {message && (
          <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateProduct} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary"
            required
          />

          <input
            type="text"
            name="slug"
            placeholder="Slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary"
              required
            />
            <input
              type="text"
              name="subcategory"
              placeholder="Subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary"
              required
            />
            <input
              type="number"
              name="stockCount"
              placeholder="Stock Count"
              value={formData.stockCount}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary"
              required
            />
            <input
              type="number"
              name="originalPrice"
              placeholder="Original Price"
              value={formData.originalPrice}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary"
            />
            <input
              type="number"
              name="discountPercentage"
              placeholder="Discount %"
              value={formData.discountPercentage}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary"
            />
          </div>

          <textarea
            name="shortDescription"
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary"
            rows={2}
            required
          />

          <textarea
            name="description"
            placeholder="Full Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary"
            rows={5}
            required
          />

          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary"
          />

          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary"
            />

            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploadingImage}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
            >
              {uploadingImage ? "Uploading..." : "Upload Image"}
            </button>

            {uploadedImageUrl && (
              <div className="rounded-lg border border-border p-4">
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded preview"
                  className="h-40 rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-text-primary">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              Featured
            </label>

            <label className="flex items-center gap-2 text-text-primary">
              <input
                type="checkbox"
                name="isOnSale"
                checked={formData.isOnSale}
                onChange={handleChange}
              />
              On Sale
            </label>
          </div>

          <button
            type="submit"
            disabled={creatingProduct}
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {creatingProduct ? "Creating Product..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}