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
  StarIcon,
} from "lucide-react";
import { productsApi } from "../services/productService";
import { userApi } from "../services/userService";
import { useApi } from "../hooks/useApi";
import { useCompare } from "../context/CompareContext";
import { useAuth } from "../context/AuthContext";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { RatingStars } from "../components/ui/RatingStars";
import { PriceDisplay } from "../components/ui/PriceDisplay";
import { Badge } from "../components/ui/Badge";

type TabType = "description" | "specs" | "reviews";

type Review = {
  _id?: string;
  name?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
};

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

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
      images:
        Array.isArray(p.images) && p.images.length > 0
          ? p.images
          : ["/placeholder-product.png"],
      reviews: Array.isArray(p.reviews) ? p.reviews : [],
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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewMessage("");
    setReviewError("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError("Please write a review comment.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${(import.meta as any).env.VITE_API_URL || "http://localhost:3000"}/api/products/${product.id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: reviewRating,
            comment: reviewComment,
          }),
        }
      );

      if (!response.ok) {
        throw await response.json();
      }

      setReviewMessage("Review submitted successfully.");
      setReviewComment("");
      setReviewRating(5);

      window.location.reload();
    } catch (err: any) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
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
                          <span className="text-text-secondary">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Customer Reviews</h2>

                    {product.reviews.length === 0 ? (
                      <p className="text-text-secondary">
                        No reviews yet. Be the first to review this product.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {product.reviews.map((review: Review, index: number) => (
                          <div
                            key={review._id || index}
                            className="rounded-xl border border-border bg-surface/50 p-4"
                          >
                            <div className="flex items-center justify-between gap-4 mb-2">
                              <div>
                                <p className="font-medium text-text-primary">
                                  {review.name || "Customer"}
                                </p>
                                <div className="mt-1">
                                  <RatingStars rating={review.rating || 0} />
                                </div>
                              </div>

                              {review.createdAt && (
                                <p className="text-sm text-text-secondary">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>

                            <p className="text-text-secondary">
                              {review.comment || "No comment provided."}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-border bg-surface/50 p-5">
                    <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

                    {!isAuthenticated ? (
                      <p className="text-text-secondary">
                        Please{" "}
                        <button
                          onClick={() => navigate("/login")}
                          className="text-primary font-medium"
                        >
                          sign in
                        </button>{" "}
                        to write a review.
                      </p>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Rating
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setReviewRating(value)}
                                className="p-1"
                              >
                                <StarIcon
                                  className={`w-5 h-5 ${
                                    value <= reviewRating
                                      ? "fill-primary text-primary"
                                      : "text-text-muted"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Comment
                          </label>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={4}
                            placeholder="Share your experience with this product..."
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                          />
                        </div>

                        {reviewMessage && (
                          <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-green-400 text-sm">
                            {reviewMessage}
                          </div>
                        )}

                        {reviewError && (
                          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-400 text-sm">
                            {reviewError}
                          </div>
                        )}

                        <button
                          type="submit"
                          className="px-5 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition"
                        >
                          Submit Review
                        </button>
                      </form>
                    )}
                  </div>
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