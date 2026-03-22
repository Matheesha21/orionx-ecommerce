import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  UsersIcon,
  PackageIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { products } from "../data/products";
import { ordersApi } from "../services/orderService";

interface AdminOrder {
  _id: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  orderStatus: string;
  createdAt: string;
  user?: {
    username?: string;
    email?: string;
  };
}

export function AdminDashboardPage() {
  const { isAdmin, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  const handleMarkPaid = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await ordersApi.markAsPaid(orderId, token);

      const updated = await ordersApi.getAllOrders(token);
      setOrders(updated);
    } catch (error) {
      console.error("Mark paid failed:", error);
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await ordersApi.markAsDelivered(orderId, token);

      const updated = await ordersApi.getAllOrders(token);
      setOrders(updated);
    } catch (error) {
      console.error("Mark delivered failed:", error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        setOrdersError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setOrdersError("Please login first");
          return;
        }

        const data = await ordersApi.getAllOrders(token);
        setOrders(data);
      } catch (error: any) {
        console.error("Admin orders error:", error.response?.data || error.message);
        setOrdersError(error.response?.data?.message || "Failed to load orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchOrders();
    } else {
      setLoadingOrders(false);
    }
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  }, [orders]);

  const lowStockProducts = products.filter((p) => p.stockCount < 10);

  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSignIcon,
      trend: `${orders.length > 0 ? "+" : ""}${orders.length} orders`,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Total Orders",
      value: orders.length.toString(),
      icon: ShoppingCartIcon,
      trend: loadingOrders ? "Loading..." : "Live data",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Total Products",
      value: products.length.toString(),
      icon: PackageIcon,
      trend: "+0",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Total Customers",
      value: new Set(orders.map((order) => order.user?.email).filter(Boolean)).size.toString(),
      icon: UsersIcon,
      trend: loadingOrders ? "Loading..." : "Unique buyers",
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Admin Dashboard
          </h1>

          <div className="flex gap-3">
            <Link
              to="/admin/products/new"
              className="px-4 py-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
            >
              Add Product
            </Link>
            <Link
              to="/admin/products"
              className="px-4 py-2 bg-surface border border-border hover:bg-surface-elevated text-text-primary font-semibold rounded-lg transition-colors"
            >
              Manage Products
            </Link>

            <button className="px-4 py-2 bg-surface border border-border hover:bg-surface-elevated text-text-primary font-semibold rounded-lg transition-colors">
              Generate Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface/50 border border-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}
                >
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
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-surface/50 border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">
                Recent Orders
              </h2>
              <button className="text-sm text-primary hover:text-primary-light">
                View All
              </button>
            </div>

            {loadingOrders ? (
              <p className="text-text-secondary">Loading orders...</p>
            ) : ordersError ? (
              <p className="text-red-400">{ordersError}</p>
            ) : orders.length === 0 ? (
              <p className="text-text-secondary">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-sm text-text-secondary">
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Total</th>
                      <th className="pb-3 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {orders.slice(0, 5).map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-border/50 last:border-0"
                      >
                        <td className="py-4 text-text-primary font-medium break-all pr-4">
                          {order._id}
                        </td>
                        <td className="py-4 text-text-secondary">
                          {order.user?.username || "Unknown User"}
                          <div className="text-xs text-text-muted">
                            {order.user?.email || ""}
                          </div>
                        </td>
                        <td className="py-4 text-text-secondary">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              order.isDelivered
                                ? "bg-green-500/10 text-green-400"
                                : order.isPaid
                                ? "bg-blue-500/10 text-blue-400"
                                : "bg-yellow-500/10 text-yellow-400"
                            }`}
                          >
                            {order.isDelivered
                              ? "Delivered"
                              : order.isPaid
                              ? "Paid"
                              : "Pending"}
                          </span>
                        </td>
                        <td className="py-4 text-text-primary font-medium text-right">
                          ${order.totalPrice}
                        </td>
                        <td className="py-4 text-center space-x-2">
                          {!order.isPaid && (
                            <button
                              onClick={() => handleMarkPaid(order._id)}
                              className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded"
                            >
                              Pay
                            </button>
                          )}

                          {!order.isDelivered && (
                            <button
                              onClick={() => handleMarkDelivered(order._id)}
                              className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded"
                            >
                              Deliver
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-surface/50 border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangleIcon className="w-5 h-5 text-warning" />
              <h2 className="text-xl font-bold text-text-primary">
                Low Stock Alerts
              </h2>
            </div>

            <div className="space-y-4">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />

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
              ))}
              {lowStockProducts.length === 0 && (
                <p className="text-text-secondary text-sm">
                  No low stock products right now.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}