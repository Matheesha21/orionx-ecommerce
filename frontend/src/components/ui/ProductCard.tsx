import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartIcon, ShoppingCartIcon, GitCompareIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "../../types";
import { useCompare } from "../../context/CompareContext";
import { Badge } from "./Badge";
import { RatingStars } from "./RatingStars";
import { PriceDisplay } from "./PriceDisplay";
import { userApi } from "../../services/userService";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const [actionMessage, setActionMessage] = useState("");
  const [inWishlist, setInWishlist] = useState(false);

  const {
    addItem: addToCompare,
    removeItem: removeFromCompare,
    isInCompare,
    canAdd,
  } = useCompare();

  const inCompare = isInCompare(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await userApi.addToCart(product.id, 1, token);
      setActionMessage("Added");
      setTimeout(() => setActionMessage(""), 1200);
    } catch (error) {
      console.error("Product card add to cart failed:", error);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (!inWishlist) {
        await userApi.addToWishlist(product.id, token);
        setInWishlist(true);
      }
    } catch (error) {
      console.error("Product card wishlist failed:", error);
    }
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCompare) {
      removeFromCompare(product.id);
    } else if (canAdd) {
      addToCompare(product);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
      }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="group block bg-white border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-card-hover transition-all duration-300"
      >
        <div className="relative aspect-square overflow-hidden bg-[#F1F3F5]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isOnSale && product.discountPercentage && (
              <Badge variant="sale">-{product.discountPercentage}%</Badge>
            )}
            {product.isFeatured && <Badge variant="featured">Featured</Badge>}
            {!product.inStock && <Badge variant="out-of-stock">Out of Stock</Badge>}
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleToggleWishlist}
              className={`w-9 h-9 flex items-center justify-center rounded-full backdrop-blur transition-colors ${
                inWishlist
                  ? "bg-red-500 text-white"
                  : "bg-white/80 text-gray-600 hover:bg-primary hover:text-white shadow-soft"
              }`}
              aria-label="Add to wishlist"
            >
              <HeartIcon className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={handleToggleCompare}
              disabled={!canAdd && !inCompare}
              className={`w-9 h-9 flex items-center justify-center rounded-full backdrop-blur transition-colors ${
                inCompare
                  ? "bg-primary text-white"
                  : "bg-white/80 text-gray-600 hover:bg-primary hover:text-white shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
              aria-label={inCompare ? "Remove from compare" : "Add to compare"}
            >
              <GitCompareIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full py-2.5 flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
            {actionMessage && (
              <p className="mt-2 text-center text-xs text-green-600">
                {actionMessage}
              </p>
            )}
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
            {product.brand}
          </p>
          <h3 className="text-sm font-medium text-text-primary line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <RatingStars
            rating={product.rating}
            showCount
            count={product.reviewCount}
            size="sm"
            className="mb-3"
          />

          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            size="md"
          />
        </div>
      </Link>
    </motion.div>
  );
}