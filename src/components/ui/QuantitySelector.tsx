import React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';
interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  size = 'md',
  className = ''
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };
  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value);
    }
  };
  const sizeClasses = {
    sm: {
      button: 'w-7 h-7',
      input: 'w-10 h-7 text-sm',
      icon: 'w-3 h-3'
    },
    md: {
      button: 'w-9 h-9',
      input: 'w-12 h-9 text-base',
      icon: 'w-4 h-4'
    },
    lg: {
      button: 'w-11 h-11',
      input: 'w-14 h-11 text-lg',
      icon: 'w-5 h-5'
    }
  };
  const styles = sizeClasses[size];
  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min}
        className={`${styles.button} flex items-center justify-center rounded-l-lg bg-surface border border-border hover:bg-surface-elevated hover:border-border-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="Decrease quantity">

        <MinusIcon className={`${styles.icon} text-text-secondary`} />
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        className={`${styles.input} text-center bg-surface border-y border-border text-text-primary focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        aria-label="Quantity" />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className={`${styles.button} flex items-center justify-center rounded-r-lg bg-surface border border-border hover:bg-surface-elevated hover:border-border-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="Increase quantity">

        <PlusIcon className={`${styles.icon} text-text-secondary`} />
      </button>
    </div>);

}