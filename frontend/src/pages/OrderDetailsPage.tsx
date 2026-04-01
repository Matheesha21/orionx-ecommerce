import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { ordersApi } from "../services/orderService";

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

interface OrderDetails {
  _id: string;
  orderItems: {
    name: string;
    image: string;
    price: number;
    qty: number;
    product?: string;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  orderStatus?: string;
  createdAt: string;
}

export function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token || !id) {
          setError("Missing order or login information");
          return;
        }

        const response = await ordersApi.getById(id, token);
        const orderData = response?.data || response;

        setOrder(orderData);
      } catch (err: any) {
        console.error(
          "Failed to load order:",
          err.response?.data || err.message
        );
        setError(err.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user && id) {
      fetchOrder();
    }
  }, [id, isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Order not found"}</p>
          <Link to="/profile" className="text-primary">
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: "My Account", href: "/profile" },
            { label: "Order Details" },
          ]}
          className="mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface/50 border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-text-muted">Order ID</p>
                  <h1 className="text-xl font-bold text-text-primary break-all">
                    {order._id}
                  </h1>
                </div>

                <div className="text-right">
                  <p className="text-sm text-text-muted">Placed On</p>
                  <p className="text-text-primary">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
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

                {order.orderStatus && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {order.orderStatus}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-surface/50 border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-text-primary mb-4">
                Order Items
              </h2>

              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div
                    key={`${order._id}-${index}`}
                    className="flex items-center gap-4 border border-border rounded-lg p-4 bg-background/40"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-surface"
                    />

                    <div className="flex-1">
                      <p className="text-text-primary font-medium">
                        {item.name}
                      </p>
                      <p className="text-sm text-text-muted">
                        Qty: {item.qty}
                      </p>
                    </div>

                    <p className="text-text-primary font-semibold">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface/50 border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-text-primary mb-4">
                Shipping Address
              </h2>

              <div className="space-y-2 text-text-secondary">
                <p>
                  <span className="text-text-primary font-medium">Name:</span>{" "}
                  {order.shippingAddress.fullName}
                </p>
                <p>
                  <span className="text-text-primary font-medium">Phone:</span>{" "}
                  {order.shippingAddress.phone}
                </p>
                <p>
                  <span className="text-text-primary font-medium">Address:</span>{" "}
                  {order.shippingAddress.address}
                </p>
                <p>
                  <span className="text-text-primary font-medium">City:</span>{" "}
                  {order.shippingAddress.city}
                </p>
                <p>
                  <span className="text-text-primary font-medium">
                    Postal Code:
                  </span>{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>
                  <span className="text-text-primary font-medium">Country:</span>{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface/50 border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-text-primary mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 border-b border-border pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Items</span>
                  <span className="text-text-primary">
                    {formatPrice(order.itemsPrice)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-text-secondary">Shipping</span>
                  <span className="text-text-primary">
                    {formatPrice(order.shippingPrice)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-text-secondary">Tax</span>
                  <span className="text-text-primary">
                    {formatPrice(order.taxPrice)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span className="text-text-primary">Total</span>
                <span className="text-primary">
                  {formatPrice(order.totalPrice)}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-text-secondary">
                  <span className="text-text-primary font-medium">Payment:</span>{" "}
                  {order.paymentMethod}
                </p>

                {order.paidAt && (
                  <p className="text-text-secondary">
                    <span className="text-text-primary font-medium">
                      Paid At:
                    </span>{" "}
                    {formatDate(order.paidAt)}
                  </p>
                )}

                {order.deliveredAt && (
                  <p className="text-text-secondary">
                    <span className="text-text-primary font-medium">
                      Delivered At:
                    </span>{" "}
                    {formatDate(order.deliveredAt)}
                  </p>
                )}
              </div>

              <Link
                to="/profile"
                className="mt-6 inline-flex w-full justify-center px-4 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition"
              >
                Back to Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}