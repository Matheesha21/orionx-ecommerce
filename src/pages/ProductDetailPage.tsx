import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  HeartIcon,
  ShoppingCartIcon,
  GitCompareIcon,
  TruckIcon,
  ShieldCheckIcon,
  RefreshCwIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  StarIcon } from
'lucide-react';
import { motion } from 'framer-motion';
import {
  getProductBySlug,
  getRelatedProducts,
  getReviewsByProductId } from
'../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { RatingStars } from '../components/ui/RatingStars';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { Badge } from '../components/ui/Badge';
import { ProductCard } from '../components/ui/ProductCard';
type TabType = 'description' | 'specs' | 'reviews';
export function ProductDetailPage() {
  const { slug } = useParams<{
    slug: string;
  }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const { addItem: addToCart } = useCart();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlist();
  const { addItem: addToCompare, isInCompare, canAdd } = useCompare();
  const product = getProductBySlug(slug || '');
  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Product Not Found
          </h1>
          <Link to="/shop" className="text-primary hover:text-primary-light">
            Back to Shop
          </Link>
        </div>
      </div>);

  }
  const relatedProducts = getRelatedProducts(product);
  const reviews = getReviewsByProductId(product.id);
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };
  const breadcrumbItems = [
  {
    label: 'Shop',
    href: '/shop'
  },
  {
    label:
    product.category.charAt(0).toUpperCase() + product.category.slice(1),
    href: `/shop?category=${product.category}`
  },
  {
    label: product.name
  }];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <motion.div
            initial={{
              opacity: 0,
              x: -20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              duration: 0.5
            }}>

            <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover" />

              {product.isOnSale && product.discountPercentage &&
              <Badge variant="sale" className="absolute top-4 left-4">
                  -{product.discountPercentage}%
                </Badge>
              }
            </div>
            {product.images.length > 1 &&
            <div className="flex gap-3">
                {product.images.map((image, index) =>
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primary' : 'border-border hover:border-border-hover'}`}>

                    <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover" />

                  </button>
              )}
              </div>
            }
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              duration: 0.5
            }}>

            <p className="text-primary font-medium mb-2">{product.brand}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <RatingStars
                rating={product.rating}
                showCount
                count={product.reviewCount}
                size="md" />

              {product.inStock ?
              <span className="flex items-center gap-1 text-green-400 text-sm">
                  <CheckIcon className="w-4 h-4" />
                  In Stock ({product.stockCount})
                </span> :

              <span className="text-red-400 text-sm">Out of Stock</span>
              }
            </div>

            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              size="xl"
              showSavings
              className="mb-6" />


            <p className="text-text-secondary mb-8">
              {product.shortDescription}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Decrease quantity">

                  <MinusIcon className="w-5 h-5" />
                </button>
                <span className="w-12 text-center text-text-primary font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                  setQuantity(Math.min(product.stockCount, quantity + 1))
                  }
                  className="p-3 text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Increase quantity">

                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-3 px-6 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors">

                <ShoppingCartIcon className="w-5 h-5" />
                Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-lg border transition-colors ${inWishlist ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'border-border text-text-secondary hover:border-primary hover:text-primary'}`}
                aria-label={
                inWishlist ? 'Remove from wishlist' : 'Add to wishlist'
                }>

                <HeartIcon
                  className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />

              </button>

              <button
                onClick={() => addToCompare(product)}
                disabled={!canAdd && !inCompare}
                className={`p-3 rounded-lg border transition-colors ${inCompare ? 'bg-primary/10 border-primary/50 text-primary' : 'border-border text-text-secondary hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed'}`}
                aria-label={inCompare ? 'In compare list' : 'Add to compare'}>

                <GitCompareIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-surface/50 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                  <TruckIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Free Shipping
                  </p>
                  <p className="text-xs text-text-muted">Orders over $100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheckIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    2 Year Warranty
                  </p>
                  <p className="text-xs text-text-muted">Full coverage</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                  <RefreshCwIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    30-Day Returns
                  </p>
                  <p className="text-xs text-text-muted">Hassle-free</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex border-b border-border mb-8">
            {(['description', 'specs', 'reviews'] as TabType[]).map((tab) =>
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}>

                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'reviews' && ` (${reviews.length})`}
                {activeTab === tab &&
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />

              }
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl">
            {activeTab === 'description' &&
            <motion.div
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="prose prose-invert max-w-none">

                <p className="text-text-secondary leading-relaxed">
                  {product.description}
                </p>
              </motion.div>
            }

            {activeTab === 'specs' &&
            <motion.div
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}>

                <div className="bg-surface/50 rounded-xl border border-border overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(product.specs).map(
                      ([key, value], index) =>
                      <tr
                        key={key}
                        className={index % 2 === 0 ? 'bg-surface/30' : ''}>

                            <td className="px-6 py-4 text-sm font-medium text-text-secondary w-1/3">
                              {key}
                            </td>
                            <td className="px-6 py-4 text-sm text-text-primary">
                              {value}
                            </td>
                          </tr>

                    )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            }

            {activeTab === 'reviews' &&
            <motion.div
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="space-y-6">

                {reviews.length === 0 ?
              <p className="text-text-secondary">No reviews yet.</p> :

              reviews.map((review) =>
              <div
                key={review.id}
                className="p-6 bg-surface/50 rounded-xl border border-border">

                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-text-primary">
                              {review.userName}
                            </span>
                            {review.verified &&
                      <Badge variant="new">Verified Purchase</Badge>
                      }
                          </div>
                          <RatingStars rating={review.rating} size="sm" />
                        </div>
                        <span className="text-xs text-text-muted">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-medium text-text-primary mb-2">
                        {review.title}
                      </h4>
                      <p className="text-text-secondary text-sm">
                        {review.comment}
                      </p>
                    </div>
              )
              }
              </motion.div>
            }
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 &&
        <section>
            <h2 className="text-2xl font-bold text-text-primary mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) =>
            <ProductCard key={product.id} product={product} index={index} />
            )}
            </div>
          </section>
        }
      </div>
    </div>);

}