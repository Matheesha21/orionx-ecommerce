import React from 'react';
import { HeroSection } from '../components/features/HeroSection';
import { CategoryShowcase } from '../components/features/CategoryShowcase';
import { FeaturedProducts } from '../components/features/FeaturedProducts';
import { DealsSection } from '../components/features/DealsSection';
import { BrandShowcase } from '../components/features/BrandShowcase';
import { NewsletterSignup } from '../components/ui/NewsletterSignup';
export function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoryShowcase />
      <FeaturedProducts />
      <DealsSection />
      <BrandShowcase />
      <NewsletterSignup />
    </div>);

}