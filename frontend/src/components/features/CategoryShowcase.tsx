import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { productsApi } from "../../services/productService";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CategoryShowcase() {
  const navigate = useNavigate();

  const { data, loading } = useApi(() => productsApi.getAll({ limit: 100 }));

  const categories = useMemo(() => {
    if (!data?.data) return [];

    const map = new Map();

    data.data.forEach((product: any) => {
      const cat = product.category?.toLowerCase();
      if (!cat) return;

      if (!map.has(cat)) {
        map.set(cat, {
          name: product.category,
          count: 1,
          image: product.images?.[0] || null,
        });
      } else {
        map.get(cat).count += 1;
      }
    });

    return Array.from(map.values());
  }, [data]);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-secondary">
          Loading categories...
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Explore Categories
          </h2>

          <button
            onClick={() => navigate("/shop")}
            className="flex items-center gap-2 text-primary font-medium hover:underline"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.04 }}
              className="relative group rounded-2xl overflow-hidden cursor-pointer shadow-md"
              onClick={() =>
                navigate(`/shop?category=${encodeURIComponent(cat.name)}`)
              }
            >
              <div className="absolute inset-0">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-600" />
                )}
              </div>

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition" />

              <div className="relative z-10 p-5 h-40 flex flex-col justify-end backdrop-blur-sm">
                <h3 className="text-white text-lg font-semibold">
                  {cat.name}
                </h3>

                <p className="text-sm text-gray-300">
                  {cat.count} products
                </p>

                <div className="mt-2 flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition">
                  Shop Now <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}