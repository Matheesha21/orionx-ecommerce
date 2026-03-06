import { Category } from '../types';

export const categories: Category[] = [
{
  id: 'laptops',
  name: 'Laptops',
  slug: 'laptops',
  description: 'Gaming, business, and ultrabook laptops',
  icon: 'Laptop',
  productCount: 8,
  image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
},
{
  id: 'desktops',
  name: 'Desktop Computers',
  slug: 'desktops',
  description: 'Gaming PCs and workstations',
  icon: 'Monitor',
  productCount: 4,
  image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d8?w=500'
},
{
  id: 'gpus',
  name: 'Graphics Cards',
  slug: 'gpus',
  description: 'NVIDIA and AMD graphics cards',
  icon: 'Cpu',
  productCount: 5,
  image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500'
},
{
  id: 'cpus',
  name: 'Processors',
  slug: 'cpus',
  description: 'Intel and AMD processors',
  icon: 'CircuitBoard',
  productCount: 4,
  image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500'
},
{
  id: 'ram',
  name: 'Memory (RAM)',
  slug: 'ram',
  description: 'DDR4 and DDR5 memory modules',
  icon: 'MemoryStick',
  productCount: 3,
  image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500'
},
{
  id: 'storage',
  name: 'Storage',
  slug: 'storage',
  description: 'SSDs and HDDs',
  icon: 'HardDrive',
  productCount: 4,
  image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500'
},
{
  id: 'monitors',
  name: 'Monitors',
  slug: 'monitors',
  description: 'Gaming and professional displays',
  icon: 'MonitorPlay',
  productCount: 4,
  image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500'
},
{
  id: 'keyboards',
  name: 'Keyboards',
  slug: 'keyboards',
  description: 'Mechanical and wireless keyboards',
  icon: 'Keyboard',
  productCount: 3,
  image: 'https://images.unsplash.com/photo-1541140532154-b024d1b23fad?w=500'
},
{
  id: 'mice',
  name: 'Mice',
  slug: 'mice',
  description: 'Gaming and ergonomic mice',
  icon: 'Mouse',
  productCount: 3,
  image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'
},
{
  id: 'accessories',
  name: 'Accessories',
  slug: 'accessories',
  description: 'Headsets, webcams, and more',
  icon: 'Headphones',
  productCount: 4,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
}];


export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find((cat) => cat.slug === slug);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find((cat) => cat.id === id);
};