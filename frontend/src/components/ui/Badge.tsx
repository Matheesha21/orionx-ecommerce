import React from 'react';
interface BadgeProps {
  variant: 'sale' | 'new' | 'out-of-stock' | 'category' | 'featured';
  children: React.ReactNode;
  className?: string;
}
export function Badge({ variant, children, className = '' }: BadgeProps) {
  const baseStyles =
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold';
  const variantStyles = {
    sale: 'bg-red-50 text-red-600 border border-red-200',
    new: 'bg-blue-50 text-blue-600 border border-blue-200',
    'out-of-stock': 'bg-gray-100 text-gray-500 border border-gray-200',
    category: 'bg-blue-50 text-blue-600 border border-blue-200',
    featured: 'bg-[#0A2540]/5 text-[#0A2540] border border-[#0A2540]/15'
  };
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>);

}