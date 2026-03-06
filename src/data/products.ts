import { Product, CouponCode, Review } from '../types';

export const products: Product[] = [
// LAPTOPS
{
  id: 'laptop-1',
  name: 'ORIONX Phantom Pro Gaming Laptop',
  slug: 'orionx-phantom-pro-gaming-laptop',
  category: 'laptops',
  subcategory: 'Gaming',
  brand: 'ORIONX',
  price: 1899,
  originalPrice: 2199,
  description:
  'The ORIONX Phantom Pro is the ultimate gaming laptop, featuring the latest NVIDIA RTX 4070 graphics, Intel Core i7-13700H processor, and a stunning 165Hz QHD display. Built for gamers who demand the best performance and style.',
  shortDescription: 'Ultimate gaming laptop with RTX 4070 and 165Hz display',
  specs: {
    Processor: 'Intel Core i7-13700H',
    Graphics: 'NVIDIA RTX 4070 8GB',
    Memory: '32GB DDR5-4800',
    Storage: '1TB NVMe SSD',
    Display: '15.6" QHD 165Hz IPS',
    Battery: '90Wh, up to 8 hours',
    Weight: '2.3 kg',
    OS: 'Windows 11 Pro'
  },
  images: [
  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'],

  rating: 4.8,
  reviewCount: 124,
  inStock: true,
  stockCount: 15,
  isFeatured: true,
  isOnSale: true,
  discountPercentage: 14,
  tags: ['gaming', 'rtx 4070', 'intel', 'high-performance'],
  createdAt: '2024-01-15T10:00:00Z'
},
{
  id: 'laptop-2',
  name: 'ASUS ROG Strix G16',
  slug: 'asus-rog-strix-g16',
  category: 'laptops',
  subcategory: 'Gaming',
  brand: 'ASUS',
  price: 1599,
  description:
  'Dominate the competition with the ROG Strix G16, featuring a powerful RTX 4060 and blazing-fast 240Hz display for competitive gaming.',
  shortDescription: 'Competitive gaming laptop with 240Hz display',
  specs: {
    Processor: 'Intel Core i7-13650HX',
    Graphics: 'NVIDIA RTX 4060 8GB',
    Memory: '16GB DDR5-4800',
    Storage: '512GB NVMe SSD',
    Display: '16" FHD 240Hz IPS',
    Battery: '76Wh',
    Weight: '2.5 kg',
    OS: 'Windows 11 Home'
  },
  images: [
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800'],

  rating: 4.6,
  reviewCount: 89,
  inStock: true,
  stockCount: 23,
  isFeatured: false,
  isOnSale: false,
  tags: ['gaming', 'rtx 4060', 'asus', '240hz'],
  createdAt: '2024-02-01T10:00:00Z'
},
{
  id: 'laptop-3',
  name: 'MacBook Pro 16" M3 Pro',
  slug: 'macbook-pro-16-m3-pro',
  category: 'laptops',
  subcategory: 'Professional',
  brand: 'Apple',
  price: 2499,
  description:
  'The most powerful MacBook Pro ever. With the M3 Pro chip, stunning Liquid Retina XDR display, and all-day battery life.',
  shortDescription: 'Professional powerhouse with M3 Pro chip',
  specs: {
    Processor: 'Apple M3 Pro (12-core CPU)',
    Graphics: '18-core GPU',
    Memory: '18GB Unified Memory',
    Storage: '512GB SSD',
    Display: '16.2" Liquid Retina XDR',
    Battery: 'Up to 22 hours',
    Weight: '2.14 kg',
    OS: 'macOS Sonoma'
  },
  images: [
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],

  rating: 4.9,
  reviewCount: 256,
  inStock: true,
  stockCount: 12,
  isFeatured: true,
  isOnSale: false,
  tags: ['professional', 'apple', 'm3', 'creative'],
  createdAt: '2024-01-20T10:00:00Z'
},
{
  id: 'laptop-4',
  name: 'Dell XPS 15',
  slug: 'dell-xps-15',
  category: 'laptops',
  subcategory: 'Ultrabook',
  brand: 'Dell',
  price: 1799,
  originalPrice: 1999,
  description:
  'The Dell XPS 15 combines stunning design with powerful performance. Perfect for professionals and creators.',
  shortDescription: 'Premium ultrabook for professionals',
  specs: {
    Processor: 'Intel Core i7-13700H',
    Graphics: 'NVIDIA RTX 4050 6GB',
    Memory: '16GB DDR5',
    Storage: '512GB NVMe SSD',
    Display: '15.6" OLED 3.5K 60Hz',
    Battery: '86Wh',
    Weight: '1.86 kg',
    OS: 'Windows 11 Pro'
  },
  images: [
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800'],

  rating: 4.7,
  reviewCount: 178,
  inStock: true,
  stockCount: 8,
  isFeatured: false,
  isOnSale: true,
  discountPercentage: 10,
  tags: ['ultrabook', 'oled', 'professional', 'dell'],
  createdAt: '2024-02-10T10:00:00Z'
},
// DESKTOPS
{
  id: 'desktop-1',
  name: 'ORIONX Titan Gaming PC',
  slug: 'orionx-titan-gaming-pc',
  category: 'desktops',
  subcategory: 'Gaming PC',
  brand: 'ORIONX',
  price: 2999,
  originalPrice: 3499,
  description:
  'The ORIONX Titan is our flagship gaming desktop, built for 4K gaming and content creation. Features the latest RTX 4080 and Intel Core i9 processor.',
  shortDescription: 'Flagship 4K gaming desktop with RTX 4080',
  specs: {
    Processor: 'Intel Core i9-14900K',
    Graphics: 'NVIDIA RTX 4080 16GB',
    Memory: '64GB DDR5-5600',
    Storage: '2TB NVMe SSD + 4TB HDD',
    Cooling: '360mm AIO Liquid Cooler',
    PSU: '850W 80+ Gold',
    Case: 'ORIONX Titan Tower RGB',
    OS: 'Windows 11 Pro'
  },
  images: [
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d8?w=800'],

  rating: 4.9,
  reviewCount: 67,
  inStock: true,
  stockCount: 5,
  isFeatured: true,
  isOnSale: true,
  discountPercentage: 14,
  tags: ['gaming', 'rtx 4080', '4k', 'flagship'],
  createdAt: '2024-01-05T10:00:00Z'
},
{
  id: 'desktop-2',
  name: 'ORIONX Nova Workstation',
  slug: 'orionx-nova-workstation',
  category: 'desktops',
  subcategory: 'Workstation',
  brand: 'ORIONX',
  price: 4499,
  description:
  'Professional workstation designed for 3D rendering, video editing, and AI development. Powered by AMD Threadripper.',
  shortDescription: 'Professional workstation for creators',
  specs: {
    Processor: 'AMD Threadripper PRO 5975WX',
    Graphics: 'NVIDIA RTX 4090 24GB',
    Memory: '128GB DDR5 ECC',
    Storage: '4TB NVMe SSD RAID',
    Cooling: 'Custom Loop Liquid Cooling',
    PSU: '1200W 80+ Platinum',
    Case: 'ORIONX Nova Tower',
    OS: 'Windows 11 Pro for Workstations'
  },
  images: [
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d8?w=800'],

  rating: 5.0,
  reviewCount: 23,
  inStock: true,
  stockCount: 3,
  isFeatured: true,
  isOnSale: false,
  tags: ['workstation', 'threadripper', 'professional', 'rtx 4090'],
  createdAt: '2024-01-10T10:00:00Z'
},
// GPUS
{
  id: 'gpu-1',
  name: 'NVIDIA GeForce RTX 4090',
  slug: 'nvidia-geforce-rtx-4090',
  category: 'gpus',
  subcategory: 'NVIDIA',
  brand: 'NVIDIA',
  price: 1599,
  description:
  'The ultimate GeForce GPU. Powered by the NVIDIA Ada Lovelace architecture and 24GB of GDDR6X memory for incredible performance.',
  shortDescription: 'Ultimate gaming GPU with 24GB GDDR6X',
  specs: {
    'CUDA Cores': '16384',
    Memory: '24GB GDDR6X',
    'Memory Bus': '384-bit',
    'Boost Clock': '2.52 GHz',
    TDP: '450W',
    Outputs: '3x DP 1.4a, 1x HDMI 2.1',
    'Ray Tracing': '3rd Gen RT Cores',
    DLSS: 'DLSS 3.0'
  },
  images: [
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800'],

  rating: 4.9,
  reviewCount: 312,
  inStock: true,
  stockCount: 7,
  isFeatured: true,
  isOnSale: false,
  tags: ['nvidia', 'rtx 4090', 'flagship', '4k gaming'],
  createdAt: '2024-01-01T10:00:00Z'
},
{
  id: 'gpu-2',
  name: 'NVIDIA GeForce RTX 4080 Super',
  slug: 'nvidia-geforce-rtx-4080-super',
  category: 'gpus',
  subcategory: 'NVIDIA',
  brand: 'NVIDIA',
  price: 999,
  description:
  'Experience incredible gaming and creative performance with the RTX 4080 Super. Perfect for 4K gaming.',
  shortDescription: 'High-end gaming GPU for 4K',
  specs: {
    'CUDA Cores': '10240',
    Memory: '16GB GDDR6X',
    'Memory Bus': '256-bit',
    'Boost Clock': '2.55 GHz',
    TDP: '320W',
    Outputs: '3x DP 1.4a, 1x HDMI 2.1',
    'Ray Tracing': '3rd Gen RT Cores',
    DLSS: 'DLSS 3.0'
  },
  images: [
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800'],

  rating: 4.8,
  reviewCount: 189,
  inStock: true,
  stockCount: 12,
  isFeatured: true,
  isOnSale: false,
  tags: ['nvidia', 'rtx 4080', '4k gaming'],
  createdAt: '2024-02-01T10:00:00Z'
},
{
  id: 'gpu-3',
  name: 'AMD Radeon RX 7900 XTX',
  slug: 'amd-radeon-rx-7900-xtx',
  category: 'gpus',
  subcategory: 'AMD',
  brand: 'AMD',
  price: 899,
  originalPrice: 999,
  description:
  'AMDs flagship gaming GPU with 24GB of GDDR6 memory and RDNA 3 architecture for exceptional 4K performance.',
  shortDescription: 'AMD flagship with 24GB GDDR6',
  specs: {
    'Stream Processors': '6144',
    Memory: '24GB GDDR6',
    'Memory Bus': '384-bit',
    'Boost Clock': '2.5 GHz',
    TDP: '355W',
    Outputs: '2x DP 2.1, 1x HDMI 2.1, 1x USB-C',
    'Ray Tracing': '2nd Gen Ray Accelerators',
    FSR: 'FSR 3.0'
  },
  images: [
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800'],

  rating: 4.7,
  reviewCount: 145,
  inStock: true,
  stockCount: 9,
  isFeatured: false,
  isOnSale: true,
  discountPercentage: 10,
  tags: ['amd', 'radeon', '7900 xtx', '4k gaming'],
  createdAt: '2024-01-15T10:00:00Z'
},
{
  id: 'gpu-4',
  name: 'NVIDIA GeForce RTX 4070 Ti Super',
  slug: 'nvidia-geforce-rtx-4070-ti-super',
  category: 'gpus',
  subcategory: 'NVIDIA',
  brand: 'NVIDIA',
  price: 799,
  description:
  'The perfect GPU for 1440p gaming with excellent ray tracing performance and DLSS 3 support.',
  shortDescription: 'Excellent 1440p gaming performance',
  specs: {
    'CUDA Cores': '8448',
    Memory: '16GB GDDR6X',
    'Memory Bus': '256-bit',
    'Boost Clock': '2.61 GHz',
    TDP: '285W',
    Outputs: '3x DP 1.4a, 1x HDMI 2.1',
    'Ray Tracing': '3rd Gen RT Cores',
    DLSS: 'DLSS 3.0'
  },
  images: [
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800'],

  rating: 4.8,
  reviewCount: 234,
  inStock: true,
  stockCount: 18,
  isFeatured: false,
  isOnSale: false,
  tags: ['nvidia', 'rtx 4070 ti', '1440p gaming'],
  createdAt: '2024-02-15T10:00:00Z'
},
// CPUS
{
  id: 'cpu-1',
  name: 'AMD Ryzen 9 7950X',
  slug: 'amd-ryzen-9-7950x',
  category: 'cpus',
  subcategory: 'AMD',
  brand: 'AMD',
  price: 549,
  originalPrice: 699,
  description:
  'The worlds best gaming processor. 16 cores and 32 threads with up to 5.7 GHz boost clock.',
  shortDescription: '16-core flagship processor',
  specs: {
    'Cores/Threads': '16 / 32',
    'Base Clock': '4.5 GHz',
    'Boost Clock': '5.7 GHz',
    Cache: '80MB (L2+L3)',
    TDP: '170W',
    Socket: 'AM5',
    'Memory Support': 'DDR5-5200',
    PCIe: 'PCIe 5.0'
  },
  images: ['https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800'],
  rating: 4.9,
  reviewCount: 423,
  inStock: true,
  stockCount: 25,
  isFeatured: true,
  isOnSale: true,
  discountPercentage: 21,
  tags: ['amd', 'ryzen', 'flagship', 'gaming'],
  createdAt: '2024-01-01T10:00:00Z'
},
{
  id: 'cpu-2',
  name: 'Intel Core i9-14900K',
  slug: 'intel-core-i9-14900k',
  category: 'cpus',
  subcategory: 'Intel',
  brand: 'Intel',
  price: 589,
  description:
  'Intels fastest desktop processor with 24 cores and up to 6.0 GHz boost clock for ultimate performance.',
  shortDescription: '24-core Intel flagship',
  specs: {
    'Cores/Threads': '24 (8P+16E) / 32',
    'Base Clock': '3.2 GHz (P-cores)',
    'Boost Clock': '6.0 GHz',
    Cache: '36MB L3',
    TDP: '125W (253W PL2)',
    Socket: 'LGA 1700',
    'Memory Support': 'DDR5-5600 / DDR4-3200',
    PCIe: 'PCIe 5.0'
  },
  images: ['https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800'],
  rating: 4.8,
  reviewCount: 356,
  inStock: true,
  stockCount: 19,
  isFeatured: true,
  isOnSale: false,
  tags: ['intel', 'core i9', 'flagship', 'gaming'],
  createdAt: '2024-01-10T10:00:00Z'
},
{
  id: 'cpu-3',
  name: 'AMD Ryzen 7 7800X3D',
  slug: 'amd-ryzen-7-7800x3d',
  category: 'cpus',
  subcategory: 'AMD',
  brand: 'AMD',
  price: 449,
  description:
  'The ultimate gaming CPU with 3D V-Cache technology for unmatched gaming performance.',
  shortDescription: 'Best gaming CPU with 3D V-Cache',
  specs: {
    'Cores/Threads': '8 / 16',
    'Base Clock': '4.2 GHz',
    'Boost Clock': '5.0 GHz',
    Cache: '104MB (L2+L3 with 3D V-Cache)',
    TDP: '120W',
    Socket: 'AM5',
    'Memory Support': 'DDR5-5200',
    PCIe: 'PCIe 5.0'
  },
  images: ['https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800'],
  rating: 4.9,
  reviewCount: 567,
  inStock: true,
  stockCount: 32,
  isFeatured: true,
  isOnSale: false,
  tags: ['amd', 'ryzen', '3d v-cache', 'gaming'],
  createdAt: '2024-02-01T10:00:00Z'
},
// RAM
{
  id: 'ram-1',
  name: 'Corsair Dominator Platinum RGB DDR5-6000 32GB',
  slug: 'corsair-dominator-platinum-rgb-ddr5-6000-32gb',
  category: 'ram',
  subcategory: 'DDR5',
  brand: 'Corsair',
  price: 189,
  description:
  'Premium DDR5 memory with stunning RGB lighting and exceptional performance for gaming and content creation.',
  shortDescription: 'Premium DDR5-6000 with RGB',
  specs: {
    Capacity: '32GB (2x16GB)',
    Speed: 'DDR5-6000',
    Timings: 'CL36-36-36-76',
    Voltage: '1.35V',
    RGB: 'Corsair iCUE Compatible',
    'Heat Spreader': 'Aluminum',
    XMP: 'Intel XMP 3.0',
    Warranty: 'Lifetime'
  },
  images: ['https://images.unsplash.com/photo-1562976540-1502c2145186?w=800'],
  rating: 4.8,
  reviewCount: 234,
  inStock: true,
  stockCount: 45,
  isFeatured: false,
  isOnSale: false,
  tags: ['corsair', 'ddr5', 'rgb', 'gaming'],
  createdAt: '2024-01-20T10:00:00Z'
},
{
  id: 'ram-2',
  name: 'G.Skill Trident Z5 RGB DDR5-6400 64GB',
  slug: 'gskill-trident-z5-rgb-ddr5-6400-64gb',
  category: 'ram',
  subcategory: 'DDR5',
  brand: 'G.Skill',
  price: 299,
  originalPrice: 349,
  description:
  'High-capacity DDR5 memory kit for enthusiasts and professionals demanding the best performance.',
  shortDescription: 'High-capacity DDR5-6400 kit',
  specs: {
    Capacity: '64GB (2x32GB)',
    Speed: 'DDR5-6400',
    Timings: 'CL32-39-39-102',
    Voltage: '1.4V',
    RGB: 'G.Skill RGB',
    'Heat Spreader': 'Aluminum',
    XMP: 'Intel XMP 3.0',
    Warranty: 'Lifetime'
  },
  images: ['https://images.unsplash.com/photo-1562976540-1502c2145186?w=800'],
  rating: 4.9,
  reviewCount: 156,
  inStock: true,
  stockCount: 28,
  isFeatured: true,
  isOnSale: true,
  discountPercentage: 14,
  tags: ['gskill', 'ddr5', 'rgb', 'high-capacity'],
  createdAt: '2024-02-05T10:00:00Z'
},
// STORAGE
{
  id: 'storage-1',
  name: 'Samsung 990 Pro 2TB NVMe',
  slug: 'samsung-990-pro-2tb-nvme',
  category: 'storage',
  subcategory: 'SSD NVMe',
  brand: 'Samsung',
  price: 179,
  originalPrice: 229,
  description:
  'Samsungs fastest consumer SSD with PCIe 4.0 speeds up to 7,450 MB/s for gaming and professional workloads.',
  shortDescription: 'Ultra-fast PCIe 4.0 NVMe SSD',
  specs: {
    Capacity: '2TB',
    Interface: 'PCIe 4.0 x4 NVMe',
    'Sequential Read': '7,450 MB/s',
    'Sequential Write': '6,900 MB/s',
    'Random Read': '1,400K IOPS',
    'Random Write': '1,550K IOPS',
    Endurance: '1,200 TBW',
    Warranty: '5 Years'
  },
  images: [
  'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800'],

  rating: 4.9,
  reviewCount: 678,
  inStock: true,
  stockCount: 67,
  isFeatured: true,
  isOnSale: true,
  discountPercentage: 22,
  tags: ['samsung', 'nvme', 'pcie 4.0', 'fast'],
  createdAt: '2024-01-01T10:00:00Z'
},
{
  id: 'storage-2',
  name: 'WD Black SN850X 1TB',
  slug: 'wd-black-sn850x-1tb',
  category: 'storage',
  subcategory: 'SSD NVMe',
  brand: 'Western Digital',
  price: 89,
  description:
  'Gaming SSD with Game Mode 2.0 for predictive loading and faster game performance.',
  shortDescription: 'Gaming-optimized NVMe SSD',
  specs: {
    Capacity: '1TB',
    Interface: 'PCIe 4.0 x4 NVMe',
    'Sequential Read': '7,300 MB/s',
    'Sequential Write': '6,300 MB/s',
    'Random Read': '800K IOPS',
    'Random Write': '1,100K IOPS',
    Endurance: '600 TBW',
    Warranty: '5 Years'
  },
  images: [
  'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800'],

  rating: 4.8,
  reviewCount: 445,
  inStock: true,
  stockCount: 89,
  isFeatured: false,
  isOnSale: false,
  tags: ['wd', 'nvme', 'gaming', 'pcie 4.0'],
  createdAt: '2024-01-15T10:00:00Z'
},
{
  id: 'storage-3',
  name: 'Seagate Barracuda 4TB HDD',
  slug: 'seagate-barracuda-4tb-hdd',
  category: 'storage',
  subcategory: 'HDD',
  brand: 'Seagate',
  price: 79,
  description:
  'Reliable high-capacity storage for games, media, and backups.',
  shortDescription: 'High-capacity storage drive',
  specs: {
    Capacity: '4TB',
    Interface: 'SATA 6Gb/s',
    RPM: '5,400 RPM',
    Cache: '256MB',
    'Form Factor': '3.5"',
    Warranty: '2 Years'
  },
  images: [
  'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800'],

  rating: 4.5,
  reviewCount: 1234,
  inStock: true,
  stockCount: 156,
  isFeatured: false,
  isOnSale: false,
  tags: ['seagate', 'hdd', 'storage', 'backup'],
  createdAt: '2024-02-01T10:00:00Z'
},
// MONITORS
{
  id: 'monitor-1',
  name: 'ASUS ROG Swift PG27AQN',
  slug: 'asus-rog-swift-pg27aqn',
  category: 'monitors',
  subcategory: 'Gaming',
  brand: 'ASUS',
  price: 899,
  description:
  'The worlds fastest 1440p gaming monitor with 360Hz refresh rate and NVIDIA G-SYNC.',
  shortDescription: '27" 1440p 360Hz gaming monitor',
  specs: {
    Size: '27 inches',
    Resolution: '2560x1440 (QHD)',
    'Refresh Rate': '360Hz',
    'Panel Type': 'IPS',
    'Response Time': '1ms GTG',
    HDR: 'HDR600',
    Sync: 'NVIDIA G-SYNC',
    Ports: '1x DP 1.4, 2x HDMI 2.0, 3x USB 3.0'
  },
  images: [
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'],

  rating: 4.8,
  reviewCount: 167,
  inStock: true,
  stockCount: 11,
  isFeatured: true,
  isOnSale: false,
  tags: ['asus', 'gaming', '360hz', 'g-sync'],
  createdAt: '2024-01-10T10:00:00Z'
},
{
  id: 'monitor-2',
  name: 'LG UltraGear 27GP950-B',
  slug: 'lg-ultragear-27gp950-b',
  category: 'monitors',
  subcategory: 'Gaming',
  brand: 'LG',
  price: 699,
  originalPrice: 799,
  description:
  '4K gaming monitor with 144Hz refresh rate, HDMI 2.1 for next-gen consoles, and Nano IPS technology.',
  shortDescription: '27" 4K 144Hz gaming monitor',
  specs: {
    Size: '27 inches',
    Resolution: '3840x2160 (4K UHD)',
    'Refresh Rate': '144Hz',
    'Panel Type': 'Nano IPS',
    'Response Time': '1ms GTG',
    HDR: 'HDR600',
    Sync: 'G-SYNC Compatible / FreeSync Premium Pro',
    Ports: '1x DP 1.4, 2x HDMI 2.1, 2x USB 3.0'
  },
  images: [
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'],

  rating: 4.7,
  reviewCount: 289,
  inStock: true,
  stockCount: 18,
  isFeatured: false,
  isOnSale: true,
  discountPercentage: 13,
  tags: ['lg', '4k', 'gaming', 'hdmi 2.1'],
  createdAt: '2024-01-20T10:00:00Z'
},
{
  id: 'monitor-3',
  name: 'Samsung Odyssey G9 49"',
  slug: 'samsung-odyssey-g9-49',
  category: 'monitors',
  subcategory: 'Ultrawide',
  brand: 'Samsung',
  price: 1299,
  description:
  'Massive 49" curved ultrawide monitor with 240Hz refresh rate for immersive gaming.',
  shortDescription: '49" curved ultrawide gaming monitor',
  specs: {
    Size: '49 inches',
    Resolution: '5120x1440 (DQHD)',
    'Refresh Rate': '240Hz',
    'Panel Type': 'VA',
    'Response Time': '1ms GTG',
    HDR: 'HDR1000',
    Curve: '1000R',
    Ports: '2x DP 1.4, 1x HDMI 2.0, 2x USB 3.0'
  },
  images: [
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'],

  rating: 4.6,
  reviewCount: 198,
  inStock: true,
  stockCount: 6,
  isFeatured: true,
  isOnSale: false,
  tags: ['samsung', 'ultrawide', 'curved', '240hz'],
  createdAt: '2024-02-01T10:00:00Z'
},
// KEYBOARDS
{
  id: 'keyboard-1',
  name: 'Corsair K100 RGB Mechanical',
  slug: 'corsair-k100-rgb-mechanical',
  category: 'keyboards',
  subcategory: 'Mechanical',
  brand: 'Corsair',
  price: 229,
  description:
  'Premium mechanical gaming keyboard with OPX optical switches, iCUE control wheel, and per-key RGB.',
  shortDescription: 'Premium optical mechanical keyboard',
  specs: {
    'Switch Type': 'Corsair OPX Optical',
    Actuation: '1.0mm',
    'Polling Rate': '4000Hz',
    Keycaps: 'PBT Double-Shot',
    RGB: 'Per-key RGB with LightEdge',
    'Wrist Rest': 'Magnetic Leatherette',
    'Media Controls': 'iCUE Control Wheel + Keys',
    Connection: 'USB Type-A'
  },
  images: [
  'https://images.unsplash.com/photo-1541140532154-b024d1b23fad?w=800'],

  rating: 4.8,
  reviewCount: 345,
  inStock: true,
  stockCount: 34,
  isFeatured: true,
  isOnSale: false,
  tags: ['corsair', 'mechanical', 'optical', 'rgb'],
  createdAt: '2024-01-05T10:00:00Z'
},
{
  id: 'keyboard-2',
  name: 'Razer BlackWidow V4 Pro',
  slug: 'razer-blackwidow-v4-pro',
  category: 'keyboards',
  subcategory: 'Mechanical',
  brand: 'Razer',
  price: 199,
  originalPrice: 229,
  description:
  'Mechanical gaming keyboard with Razer Green switches, command dial, and Chroma RGB.',
  shortDescription: 'Mechanical keyboard with command dial',
  specs: {
    'Switch Type': 'Razer Green Mechanical',
    Actuation: '1.9mm',
    'Polling Rate': '8000Hz',
    Keycaps: 'Doubleshot ABS',
    RGB: 'Razer Chroma RGB',
    'Wrist Rest': 'Plush Leatherette',
    'Media Controls': 'Command Dial + Keys',
    Connection: 'USB Type-C'
  },
  images: [
  'https://images.unsplash.com/photo-1541140532154-b024d1b23fad?w=800'],

  rating: 4.7,
  reviewCount: 278,
  inStock: true,
  stockCount: 42,
  isFeatured: false,
  isOnSale: true,
  discountPercentage: 13,
  tags: ['razer', 'mechanical', 'rgb', 'gaming'],
  createdAt: '2024-01-20T10:00:00Z'
},
// MICE
{
  id: 'mouse-1',
  name: 'Logitech G Pro X Superlight 2',
  slug: 'logitech-g-pro-x-superlight-2',
  category: 'mice',
  subcategory: 'Gaming',
  brand: 'Logitech',
  price: 159,
  description:
  'Ultra-lightweight wireless gaming mouse with HERO 2 sensor and LIGHTSPEED technology.',
  shortDescription: 'Ultra-light wireless gaming mouse',
  specs: {
    Sensor: 'HERO 2 (32K DPI)',
    Weight: '60g',
    Buttons: '5 Programmable',
    'Polling Rate': '2000Hz',
    Battery: 'Up to 95 hours',
    Connection: 'LIGHTSPEED Wireless',
    Switches: 'LIGHTFORCE Hybrid',
    Feet: 'PTFE'
  },
  images: [
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'],

  rating: 4.9,
  reviewCount: 567,
  inStock: true,
  stockCount: 56,
  isFeatured: true,
  isOnSale: false,
  tags: ['logitech', 'wireless', 'lightweight', 'esports'],
  createdAt: '2024-01-01T10:00:00Z'
},
{
  id: 'mouse-2',
  name: 'Razer DeathAdder V3 Pro',
  slug: 'razer-deathadder-v3-pro',
  category: 'mice',
  subcategory: 'Gaming',
  brand: 'Razer',
  price: 149,
  originalPrice: 169,
  description:
  'Ergonomic wireless gaming mouse with Focus Pro 30K sensor and iconic DeathAdder shape.',
  shortDescription: 'Ergonomic wireless gaming mouse',
  specs: {
    Sensor: 'Focus Pro 30K',
    Weight: '63g',
    Buttons: '5 Programmable',
    'Polling Rate': '4000Hz (HyperPolling)',
    Battery: 'Up to 90 hours',
    Connection: 'HyperSpeed Wireless',
    Switches: 'Optical Gen-3',
    Feet: 'PTFE'
  },
  images: [
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'],

  rating: 4.8,
  reviewCount: 423,
  inStock: true,
  stockCount: 38,
  isFeatured: false,
  isOnSale: true,
  discountPercentage: 12,
  tags: ['razer', 'wireless', 'ergonomic', 'gaming'],
  createdAt: '2024-01-15T10:00:00Z'
},
// ACCESSORIES
{
  id: 'accessory-1',
  name: 'SteelSeries Arctis Nova Pro Wireless',
  slug: 'steelseries-arctis-nova-pro-wireless',
  category: 'accessories',
  subcategory: 'Headsets',
  brand: 'SteelSeries',
  price: 349,
  description:
  'Premium wireless gaming headset with active noise cancellation, hot-swap batteries, and Hi-Res audio.',
  shortDescription: 'Premium ANC wireless gaming headset',
  specs: {
    Driver: '40mm Neodymium',
    'Frequency Response': '10-40,000 Hz',
    ANC: 'Active Noise Cancellation',
    Microphone: 'Retractable ClearCast Gen 2',
    Battery: 'Hot-swap (2x 18hr batteries)',
    Connection: '2.4GHz + Bluetooth',
    Surround: '360° Spatial Audio',
    Compatibility: 'PC, PS5, Switch, Mobile'
  },
  images: [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],

  rating: 4.8,
  reviewCount: 234,
  inStock: true,
  stockCount: 23,
  isFeatured: true,
  isOnSale: false,
  tags: ['steelseries', 'headset', 'wireless', 'anc'],
  createdAt: '2024-01-10T10:00:00Z'
},
{
  id: 'accessory-2',
  name: 'Elgato Facecam Pro',
  slug: 'elgato-facecam-pro',
  category: 'accessories',
  subcategory: 'Webcams',
  brand: 'Elgato',
  price: 299,
  description:
  '4K60 webcam with Sony sensor, auto-focus, and professional image quality for streaming and video calls.',
  shortDescription: '4K60 professional webcam',
  specs: {
    Resolution: '4K @ 60fps',
    Sensor: 'Sony STARVIS',
    'Field of View': '90° (adjustable)',
    Focus: 'Auto-focus',
    HDR: 'Yes',
    Connection: 'USB-C',
    Mount: 'Adjustable clip + 1/4" thread',
    Software: 'Camera Hub'
  },
  images: [
  'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800'],

  rating: 4.7,
  reviewCount: 156,
  inStock: true,
  stockCount: 19,
  isFeatured: false,
  isOnSale: false,
  tags: ['elgato', 'webcam', '4k', 'streaming'],
  createdAt: '2024-01-20T10:00:00Z'
},
{
  id: 'accessory-3',
  name: 'NZXT H7 Elite Case',
  slug: 'nzxt-h7-elite-case',
  category: 'accessories',
  subcategory: 'Cases',
  brand: 'NZXT',
  price: 199,
  originalPrice: 229,
  description:
  'Premium mid-tower case with tempered glass panels, RGB fans, and excellent airflow.',
  shortDescription: 'Premium mid-tower PC case',
  specs: {
    'Form Factor': 'Mid-Tower ATX',
    'Motherboard Support': 'Mini-ITX to E-ATX',
    'GPU Clearance': '400mm',
    'CPU Cooler Height': '185mm',
    'Fans Included': '4x 140mm RGB',
    'Radiator Support': 'Up to 360mm (top/front)',
    'Drive Bays': '2x 2.5" + 2x 3.5"',
    'I/O': 'USB-C, 2x USB-A, Audio'
  },
  images: [
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d8?w=800'],

  rating: 4.8,
  reviewCount: 312,
  inStock: true,
  stockCount: 27,
  isFeatured: false,
  isOnSale: true,
  discountPercentage: 13,
  tags: ['nzxt', 'case', 'rgb', 'airflow'],
  createdAt: '2024-02-01T10:00:00Z'
}];


export const couponCodes: CouponCode[] = [
{
  code: 'ORIONX10',
  discountType: 'percentage',
  discountValue: 10,
  minPurchase: 50,
  isActive: true
},
{
  code: 'TECH20',
  discountType: 'percentage',
  discountValue: 20,
  minPurchase: 200,
  maxDiscount: 100,
  isActive: true
},
{
  code: 'SAVE50',
  discountType: 'fixed',
  discountValue: 50,
  minPurchase: 300,
  isActive: true
}];


export const reviews: Review[] = [
{
  id: 'review-1',
  productId: 'laptop-1',
  userId: 'user-1',
  userName: 'Alex Chen',
  rating: 5,
  title: "Best gaming laptop I've ever owned!",
  comment:
  'The ORIONX Phantom Pro exceeded all my expectations. The RTX 4070 handles every game at max settings, and the 165Hz display is buttery smooth. Build quality is excellent.',
  helpful: 45,
  verified: true,
  createdAt: '2024-02-15T10:00:00Z'
},
{
  id: 'review-2',
  productId: 'laptop-1',
  userId: 'user-2',
  userName: 'Sarah Miller',
  rating: 4,
  title: 'Great performance, runs a bit warm',
  comment:
  'Fantastic gaming performance and the display is gorgeous. Only minor complaint is it can get warm during extended gaming sessions. Still highly recommend.',
  helpful: 23,
  verified: true,
  createdAt: '2024-02-10T10:00:00Z'
},
{
  id: 'review-3',
  productId: 'gpu-1',
  userId: 'user-3',
  userName: 'Mike Johnson',
  rating: 5,
  title: 'The king of GPUs',
  comment:
  'If you want the absolute best, this is it. 4K gaming at max settings with ray tracing is finally possible. DLSS 3 is a game changer.',
  helpful: 89,
  verified: true,
  createdAt: '2024-01-20T10:00:00Z'
}];


export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((p) => p.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((p) => p.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((p) => p.isFeatured);
};

export const getOnSaleProducts = (): Product[] => {
  return products.filter((p) => p.isOnSale);
};

export const getRelatedProducts = (
product: Product,
limit: number = 4)
: Product[] => {
  return products.
  filter((p) => p.category === product.category && p.id !== product.id).
  slice(0, limit);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.brand.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

export const validateCoupon = (code: string): CouponCode | null => {
  const coupon = couponCodes.find(
    (c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive
  );
  return coupon || null;
};

export const getReviewsByProductId = (productId: string): Review[] => {
  return reviews.filter((r) => r.productId === productId);
};