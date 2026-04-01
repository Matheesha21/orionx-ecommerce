import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  UserIcon,
  PackageIcon,
  MapPinIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { ordersApi } from "../services/orderService";

interface Order {
  _id: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  orderStatus: string;
  createdAt: string;
  orderItems: {
    name: string;
    qty: number;
    image: string;
    price: number;
  }[];
}

export function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        setOrdersError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setOrdersError("Please login first");
          setLoadingOrders(false);
          return;
        }

        const data = await ordersApi.getMyOrders(token);
        setOrders(data);
      } catch (error: any) {
        console.error(
          "Failed to load orders:",
          error.response?.data || error.message
        );
        setOrdersError(error.response?.data?.message || "Failed to load orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            {
              label: "My Account",
            },
          ]}
          className="mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-surface/50 border border-border rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-primary" />
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-bold text-text-primary">
                    {user.name}
                  </h2>
                  <p className="text-sm text-text-muted">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-colors">
                  <UserIcon className="w-5 h-5" />
                  Profile Details
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-surface-elevated hover:text-text-primary rounded-lg font-medium transition-colors">
                  <PackageIcon className="w-5 h-5" />
                  Order History
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-surface-elevated hover:text-text-primary rounded-lg font-medium transition-colors">
                  <MapPinIcon className="w-5 h-5" />
                  Saved Addresses
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-surface-elevated hover:text-text-primary rounded-lg font-medium transition-colors">
                  <SettingsIcon className="w-5 h-5" />
                  Account Settings
                </button>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg font-medium transition-colors mt-4"
                >
                  <LogOutIcon className="w-5 h-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-surface/50 border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-text-primary mb-6">
                Profile Details
              </h3>

              <form className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      disabled
                      className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-text-muted cursor-not-allowed"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </form>
            </div>

            <div className="bg-surface/50 border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-text-primary">
                  Recent Orders
                </h3>
                <button className="text-sm text-primary hover:text-primary-light">
                  View All
                </button>
              </div>

              {loadingOrders ? (
                <div className="text-center py-10 text-text-secondary">
                  Loading orders...
                </div>
              ) : ordersError ? (
                <div className="text-center py-10 text-red-400">
                  {ordersError}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                  <PackageIcon className="w-12 h-12 text-text-muted mx-auto mb-4" />
                  <p className="text-text-secondary">
                    You haven't placed any orders yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order._id}
                      className="border border-border rounded-lg p-4 bg-background/40"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                          <p className="text-sm text-text-muted">Order ID</p>
                          <p className="text-text-primary font-medium break-all">
                            {order._id}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-text-muted">Date</p>
                          <p className="text-text-primary">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-text-muted">Total</p>
                          <p className="text-text-primary font-semibold">
                            {formatPrice(order.totalPrice)}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-text-muted">Status</p>
                          <p className="text-text-primary">{order.orderStatus}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.orderItems.map((item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className="flex items-center gap-4"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 rounded-lg object-cover bg-surface"
                            />

                            <div className="flex-1">
                              <p className="text-text-primary font-medium">
                                {item.name}
                              </p>
                              <p className="text-sm text-text-muted">
                                Qty: {item.qty}
                              </p>
                            </div>

                            <p className="text-text-primary font-medium">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.isPaid
                              ? "bg-green-500/10 text-green-400"
                              : "bg-yellow-500/10 text-yellow-400"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "Not Paid"}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.isDelivered
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-orange-500/10 text-orange-400"
                          }`}
                        >
                          {order.isDelivered ? "Delivered" : "Not Delivered"}
                        </span>
                      </div>

                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-flex mt-3 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}