import React, { useMemo, useState } from 'react';
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
  PlusIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { productsApi } from '../services/api';
import { useApi } from '../hooks/useApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { RatingStars } from '../components/ui/RatingStars';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { Badge } from '../components/ui/Badge';

type TabType = 'description' | 'specs' | 'reviews';

export function ProductDetailPage() {

  const { slug } = useParams<{ slug: string }>();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('description');

  const { addItem: addToCart } = useCart();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlist();
  const { addItem: addToCompare, isInCompare, canAdd } = useCompare();

  const { data: productResponse, loading, error } = useApi(
    () => productsApi.getBySlug(slug || ''),
    [slug]
  );

  const product = useMemo(() => {
    if (!productResponse?.data) return null;

    const p: any = productResponse.data;

    return {
      ...p,
      id: p.id || p._id
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

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const breadcrumbItems = [
    { label: 'Shop', href: '/shop' },
    {
      label: product.category,
      href: `/shop?category=${product.category}`
    },
    { label: product.name }
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
                      className="w-20 h-20 object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}

          </div>

          <div>

            <p className="text-primary font-medium mb-2">
              {product.brand}
            </p>

            <h1 className="text-3xl font-bold mb-4">
              {product.name}
            </h1>

            <div className="mb-4">
              <RatingStars rating={product.rating} />
            </div>

            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
            />

            <p className="mt-6 mb-6 text-text-secondary">
              {product.shortDescription}
            </p>

            <div className="flex items-center gap-4 mb-6">

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
                className="bg-primary text-white px-6 py-3 rounded flex items-center gap-2"
              >
                <ShoppingCartIcon size={18} />
                Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className="p-3 border rounded"
              >
                <HeartIcon size={18} />
              </button>

              <button
                onClick={() => addToCompare(product)}
                className="p-3 border rounded"
              >
                <GitCompareIcon size={18} />
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}