import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LaptopIcon,
  MonitorIcon,
  CpuIcon,
  CircuitBoardIcon,
  HardDriveIcon,
  KeyboardIcon,
  MouseIcon,
  HeadphonesIcon,
  MemoryStickIcon,
  MonitorPlayIcon } from
'lucide-react';
import { Category } from '../../types';
interface CategoryCardProps {
  category: Category;
  index?: number;
}
const iconMap: Record<
  string,
  ComponentType<{
    className?: string;
  }>> =
{
  Laptop: LaptopIcon,
  Monitor: MonitorIcon,
  Cpu: CpuIcon,
  CircuitBoard: CircuitBoardIcon,
  HardDrive: HardDriveIcon,
  Keyboard: KeyboardIcon,
  Mouse: MouseIcon,
  Headphones: HeadphonesIcon,
  MemoryStick: MemoryStickIcon,
  MonitorPlay: MonitorPlayIcon
};
export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon] || CpuIcon;
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.05
      }}>

      <Link
        to={`/shop?category=${category.slug}`}
        className="group block relative overflow-hidden rounded-xl bg-white border border-border hover:border-primary/40 hover:shadow-card-hover transition-all duration-300">

        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover opacity-10 group-hover:opacity-15 group-hover:scale-110 transition-all duration-500" />

          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/70" />
        </div>

        {/* Content */}
        <div className="relative p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-primary/8 border border-primary/15 mb-4 group-hover:bg-primary/12 group-hover:border-primary/30 transition-all duration-300">
            <IconComponent className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-text-muted">
            {category.productCount} products
          </p>
        </div>

        {/* Hover Bottom Accent */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
      </Link>
    </motion.div>);

}