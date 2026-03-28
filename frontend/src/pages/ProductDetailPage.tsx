import React, { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  HeartIcon,
  ShoppingCartIcon,
  GitCompareIcon,
  MinusIcon,
  PlusIcon,
  TruckIcon,
  ShieldCheckIcon,
  RefreshCwIcon,
  CheckIcon,
} from "lucide-react";
import { productsApi } from "../services/productService";
import { userApi } from "../services/userService";
import { useApi } from "../hooks/useApi";
import { useCompare } from "../context/CompareContext";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { RatingStars } from "../components/ui/RatingStars";
import { PriceDisplay } from "../components/ui/PriceDisplay";
import { Badge } from "../components/ui/Badge";

type TabType = "description" | "specs" | "reviews";

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const { addItem: addToCompare, isInCompare, canAdd } = useCompare();

  const { data: productResponse, loading, error } = useApi(
    () => productsApi.getBySlug(slug || ""),
    [slug]
  );

  const product = useMemo(() => {
    if (!productResponse?.data) return null;

    const p: any = productResponse.data;

    return {
      ...p,
      id: p.id || p._id,
      images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ["/placeholder-product.png"],
    };
  }, [productResponse]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const inCompare = isInCompare(product.id);

  const handleAddToCart = async () => {
    try {
      setActionMessage("");
      setActionError("");
      setAddingToCart(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await userApi.addToCart(product.id, quantity, token);
      setActionMessage("Added to cart successfully");
    } catch (err: any) {
      console.error("Add to cart failed:", err.response?.data || err.message);
      setActionError(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      setActionMessage("");
      setActionError("");
      setAddingToWishlist(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await userApi.addToWishlist(product.id, token);
      setActionMessage("Added to wishlist successfully");
    } catch (err: any) {
      console.error("Add to wishlist failed:", err.response?.data || err.message);
      setActionError(err.response?.data?.message || "Failed to add to wishlist");
    } finally {
      setAddingToWishlist(false);
    }
  };

  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    {
      label: product.category,
      href: `/shop?category=${encodeURIComponent(product.category)}`,
    },
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square bg-surface rounded-xl overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)}>
                    <img
                      src={img}
                      alt={`${product.name}-${i}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-primary font-medium mb-2">{product.brand}</p>

            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="mb-4">
              <RatingStars rating={product.rating || 0} />
            </div>

            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
            />

            <p className="mt-6 mb-6 text-text-secondary">
              {product.shortDescription || product.description}
            </p>

            {actionMessage && (
              <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-green-400">
                {actionMessage}
              </div>
            )}

            {actionError && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-400">
                {actionError}
              </div>
            )}

            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <div className="flex border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2"
                >
                  <MinusIcon size={18} />
                </button>

                <span className="px-4 py-2">{quantity}</span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2"
                >
                  <PlusIcon size={18} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !product.inStock}
                className="bg-primary text-white px-6 py-3 rounded flex items-center gap-2 disabled:opacity-50"
              >
                <ShoppingCartIcon size={18} />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>

              <button
                onClick={handleAddToWishlist}
                disabled={addingToWishlist}
                className="p-3 border rounded disabled:opacity-50"
                title="Add to Wishlist"
              >
                <HeartIcon size={18} />
              </button>

              <button
                onClick={() => addToCompare(product)}
                disabled={!canAdd || inCompare}
                className="p-3 border rounded disabled:opacity-50"
                title="Add to Compare"
              >
                <GitCompareIcon size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
              <div className="p-4 rounded-lg border border-border bg-surface/50">
                <TruckIcon className="w-5 h-5 mb-2 text-primary" />
                <p className="font-medium">Fast Delivery</p>
                <p className="text-sm text-text-secondary">3-5 business days</p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-surface/50">
                <ShieldCheckIcon className="w-5 h-5 mb-2 text-primary" />
                <p className="font-medium">Warranty</p>
                <p className="text-sm text-text-secondary">1 year standard</p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-surface/50">
                <RefreshCwIcon className="w-5 h-5 mb-2 text-primary" />
                <p className="font-medium">Returns</p>
                <p className="text-sm text-text-secondary">Within 7 days</p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === "description"
                      ? "bg-primary text-white"
                      : "bg-surface border border-border"
                  }`}
                >
                  Description
                </button>

                <button
                  onClick={() => setActiveTab("specs")}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === "specs"
                      ? "bg-primary text-white"
                      : "bg-surface border border-border"
                  }`}
                >
                  Specs
                </button>

                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === "reviews"
                      ? "bg-primary text-white"
                      : "bg-surface border border-border"
                  }`}
                >
                  Reviews
                </button>
              </div>

              {activeTab === "description" && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-text-secondary">{product.description}</p>
                </div>
              )}

              {activeTab === "specs" && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Specifications</h2>
                  <div className="space-y-2">
                    {product.specs &&
                      Object.entries(product.specs).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between border-b border-border py-2"
                        >
                          <span className="font-medium">{key}</span>
                          <span className="text-text-secondary">{String(value)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Reviews</h2>
                  <p className="text-text-secondary">
                    Reviews section coming next.
                  </p>
                </div>
              )}
            </div>

            {inCompare && (
              <p className="mt-4 text-sm text-primary flex items-center gap-2">
                <CheckIcon className="w-4 h-4" />
                This product is already in compare.
              </p>
            )}

            {product.inStock ? (
              <Badge variant="featured" className="mt-4">
                In Stock
              </Badge>
            ) : (
              <Badge variant="out-of-stock" className="mt-4">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}