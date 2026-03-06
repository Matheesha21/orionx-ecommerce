import React from 'react';
import { StarIcon } from 'lucide-react';
interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  showCount?: boolean;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export function RatingStars({
  rating,
  maxRating = 5,
  showCount = false,
  count,
  size = 'md',
  className = ''
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({
          length: maxRating
        }).map((_, index) => {
          const filled = index < Math.floor(rating);
          const partial = index === Math.floor(rating) && rating % 1 !== 0;
          return (
            <div key={index} className="relative">
              <StarIcon
                className={`${sizeClasses[size]} ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />

              {partial &&
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: `${rating % 1 * 100}%`
                }}>

                  <StarIcon
                  className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`} />

                </div>
              }
            </div>);

        })}
      </div>
      {showCount && count !== undefined &&
      <span className={`text-text-secondary ${textSizeClasses[size]}`}>
          ({count})
        </span>
      }
    </div>);

}