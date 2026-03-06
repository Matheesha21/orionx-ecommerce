import React from 'react';
import { motion } from 'framer-motion';
const brands = [
{
  name: 'NVIDIA',
  logo: 'NVIDIA'
},
{
  name: 'AMD',
  logo: 'AMD'
},
{
  name: 'Intel',
  logo: 'Intel'
},
{
  name: 'ASUS',
  logo: 'ASUS'
},
{
  name: 'MSI',
  logo: 'MSI'
},
{
  name: 'Corsair',
  logo: 'CORSAIR'
},
{
  name: 'Logitech',
  logo: 'Logitech'
},
{
  name: 'Razer',
  logo: 'RAZER'
},
{
  name: 'Samsung',
  logo: 'SAMSUNG'
},
{
  name: 'Western Digital',
  logo: 'WD'
}];

export function BrandShowcase() {
  return (
    <section className="py-12 md:py-16 bg-background-secondary border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          className="text-center text-text-muted text-sm uppercase tracking-wider mb-8"
          initial={{
            opacity: 0
          }}
          whileInView={{
            opacity: 1
          }}
          viewport={{
            once: true
          }}>

          Trusted by the world's leading brands
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
          initial={{
            opacity: 0
          }}
          whileInView={{
            opacity: 1
          }}
          viewport={{
            once: true
          }}
          transition={{
            delay: 0.2
          }}>

          {brands.map((brand, index) =>
          <motion.div
            key={brand.name}
            className="text-text-muted hover:text-text-secondary transition-colors"
            initial={{
              opacity: 0,
              y: 10
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: index * 0.05
            }}>

              <span className="text-lg md:text-xl font-bold tracking-wider">
                {brand.logo}
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>);

}