import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  UsersIcon,
  PackageIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  AlertTriangleIcon } from
'lucide-react';
import { useAuth } from '../context/AuthContext';
import { products } from '../data/products';
export function AdminDashboardPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  const stats = [
  {
    label: 'Total Revenue',
    value: '$124,500',
    icon: DollarSignIcon,
    trend: '+12.5%',
    color: 'text-green-400',
    bg: 'bg-green-400/10'
  },
  {
    label: 'Total Orders',
    value: '842',
    icon: ShoppingCartIcon,
    trend: '+5.2%',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  {
    label: 'Total Products',
    value: products.length.toString(),
    icon: PackageIcon,
    trend: '+2',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  },
  {
    label: 'Total Customers',
    value: '1,204',
    icon: UsersIcon,
    trend: '+18.1%',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10'
  }];

  const lowStockProducts = products.filter((p) => p.stockCount < 10);
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Admin Dashboard
          </h1>
          <button className="px-4 py-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors">
            Generate Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) =>
          <div
            key={stat.label}
            className="bg-surface/50 border border-border rounded-xl p-6">

              <div className="flex items-center justify-between mb-4">
                <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>

                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="flex items-center text-sm text-green-400 font-medium">
                  <TrendingUpIcon className="w-4 h-4 mr-1" />
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-text-secondary text-sm font-medium mb-1">
                {stat.label}
              </h3>
              <p className="text-2xl font-bold text-text-primary">
                {stat.value}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders Placeholder */}
          <div className="lg:col-span-2 bg-surface/50 border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">
                Recent Orders
              </h2>
              <button className="text-sm text-primary hover:text-primary-light">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-sm text-text-secondary">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[1, 2, 3, 4, 5].map((i) =>
                  <tr
                    key={i}
                    className="border-b border-border/50 last:border-0">

                      <td className="py-4 text-text-primary font-medium">
                        #ORX-00{i}
                      </td>
                      <td className="py-4 text-text-secondary">
                        Customer Name
                      </td>
                      <td className="py-4 text-text-secondary">
                        Today, 10:00 AM
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                          Completed
                        </span>
                      </td>
                      <td className="py-4 text-text-primary font-medium text-right">
                        $1,299.00
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-surface/50 border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangleIcon className="w-5 h-5 text-warning" />
              <h2 className="text-xl font-bold text-text-primary">
                Low Stock Alerts
              </h2>
            </div>

            <div className="space-y-4">
              {lowStockProducts.slice(0, 5).map((product) =>
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">

                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover" />

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-text-muted">{product.brand}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-bold text-warning">
                      {product.stockCount} left
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>);

}