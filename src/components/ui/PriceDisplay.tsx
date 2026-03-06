import React from 'react';
interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSavings?: boolean;
  className?: string;
}
export function PriceDisplay({
  price,
  originalPrice,
  size = 'md',
  showSavings = false,
  className = ''
}: PriceDisplayProps) {
  const isOnSale = originalPrice && originalPrice > price;
  const savings = isOnSale ? originalPrice - price : 0;
  const savingsPercent = isOnSale ?
  Math.round(savings / originalPrice * 100) :
  0;
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };
  const originalSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  return (
    <div className={`flex flex-wrap items-baseline gap-2 ${className}`}>
      <span
        className={`font-bold text-text-primary ${sizeClasses[size]} ${isOnSale ? 'text-cyan-400' : ''}`}>

        {formatPrice(price)}
      </span>
      {isOnSale &&
      <>
          <span
          className={`text-text-muted line-through ${originalSizeClasses[size]}`}>

            {formatPrice(originalPrice)}
          </span>
          {showSavings &&
        <span
          className={`text-green-400 font-medium ${originalSizeClasses[size]}`}>

              Save {savingsPercent}%
            </span>
        }
        </>
      }
    </div>);

}