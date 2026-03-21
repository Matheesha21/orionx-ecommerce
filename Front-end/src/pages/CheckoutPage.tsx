import React, { useState, Fragment, ComponentType } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  CheckIcon,
  CreditCardIcon,
  TruckIcon,
  ClipboardCheckIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { CheckoutFormData } from "../types";
import { ordersApi } from "../services/orderService";

type Step = "shipping" | "payment" | "review" | "confirmation";

const steps: {
  id: Step;
  label: string;
  icon: ComponentType<{
    className?: string;
  }>;
}[] = [
  {
    id: "shipping",
    label: "Shipping",
    icon: TruckIcon,
  },
  {
    id: "payment",
    label: "Payment",
    icon: CreditCardIcon,
  },
  {
    id: "review",
    label: "Review",
    icon: ClipboardCheckIcon,
  },
];

export function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [orderNumber, setOrderNumber] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placeOrderError, setPlaceOrderError] = useState("");

  const [formData, setFormData] = useState<CheckoutFormData>({
    shipping: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
    payment: {
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
    },
  });

  const { items, subtotal, discount, tax, shipping, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: {
            pathname: "/checkout",
          },
        }}
        replace
      />
    );
  }

  if (items.length === 0 && currentStep !== "confirmation") {
    return <Navigate to="/cart" replace />;
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("review");
  };

  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true);
      setPlaceOrderError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setPlaceOrderError("Please login first");
        return;
      }

      const orderItems = items.map((item) => ({
        product: item.product._id || item.product.id,
        name: item.product.name,
        image: item.product.images?.[0] || "",
        price: item.product.price,
        qty: item.quantity,
      }));

      const orderData = {
        orderItems,
        shippingAddress: {
          fullName: `${formData.shipping.firstName} ${formData.shipping.lastName}`.trim(),
          phone: formData.shipping.phone,
          address: formData.shipping.address,
          city: formData.shipping.city,
          postalCode: formData.shipping.zipCode,
          country: formData.shipping.state || "Sri Lanka",
        },
        paymentMethod: "Card",
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      };

      const createdOrder = await ordersApi.create(orderData, token);

      setOrderNumber(createdOrder._id || `ORX-${Date.now().toString(36).toUpperCase()}`);
      clearCart();
      setCurrentStep("confirmation");
    } catch (error: any) {
      console.error("Order creation failed:", error.response?.data || error.message);
      setPlaceOrderError(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const updateShipping = (
    field: keyof CheckoutFormData["shipping"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        [field]: value,
      },
    }));
  };

  const updatePayment = (
    field: keyof CheckoutFormData["payment"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        [field]: value,
      },
    }));
  };

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            {
              label: "Cart",
              href: "/cart",
            },
            {
              label: "Checkout",
            },
          ]}
          className="mb-8"
        />

        {currentStep !== "confirmation" && (
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <Fragment key={step.id}>
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        index <= stepIndex
                          ? "bg-primary border-primary text-white"
                          : "border-border text-text-muted"
                      }`}
                    >
                      {index < stepIndex ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`ml-3 text-sm font-medium hidden sm:block ${
                        index <= stepIndex ? "text-text-primary" : "text-text-muted"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        index < stepIndex ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === "shipping" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-surface/50 border border-border rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold text-text-primary mb-6">
                  Shipping Information
                </h2>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.shipping.firstName}
                        onChange={(e) => updateShipping("firstName", e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.shipping.lastName}
                        onChange={(e) => updateShipping("lastName", e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.shipping.email}
                        onChange={(e) => updateShipping("email", e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.shipping.phone}
                        onChange={(e) => updateShipping("phone", e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shipping.address}
                      onChange={(e) => updateShipping("address", e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.shipping.city}
                        onChange={(e) => updateShipping("city", e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.shipping.state}
                        onChange={(e) => updateShipping("state", e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.shipping.zipCode}
                        onChange={(e) => updateShipping("zipCode", e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors mt-6"
                  >
                    Continue to Payment
                  </button>
                </form>
              </motion.div>
            )}

            {currentStep === "payment" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-surface/50 border border-border rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold text-text-primary mb-6">
                  Payment Information
                </h2>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={formData.payment.cardNumber}
                      onChange={(e) => updatePayment("cardNumber", e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.payment.cardName}
                      onChange={(e) => updatePayment("cardName", e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={formData.payment.expiry}
                        onChange={(e) => updatePayment("expiry", e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={formData.payment.cvv}
                        onChange={(e) => updatePayment("cvv", e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep("shipping")}
                      className="flex-1 py-3 border border-border text-text-secondary hover:text-text-primary rounded-lg transition-colors"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="flex-1 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentStep === "review" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-surface/50 border border-border rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">
                      Shipping Address
                    </h3>
                    <button
                      onClick={() => setCurrentStep("shipping")}
                      className="text-sm text-primary hover:text-primary-light"
                    >
                      Edit
                    </button>
                  </div>

                  <p className="text-text-secondary">
                    {formData.shipping.firstName} {formData.shipping.lastName}
                    <br />
                    {formData.shipping.address}
                    <br />
                    {formData.shipping.city}, {formData.shipping.state}{" "}
                    {formData.shipping.zipCode}
                    <br />
                    {formData.shipping.phone}
                  </p>
                </div>

                <div className="bg-surface/50 border border-border rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">
                      Payment Method
                    </h3>
                    <button
                      onClick={() => setCurrentStep("payment")}
                      className="text-sm text-primary hover:text-primary-light"
                    >
                      Edit
                    </button>
                  </div>

                  <p className="text-text-secondary">
                    Card ending in {formData.payment.cardNumber.slice(-4)}
                  </p>
                </div>

                <div className="bg-surface/50 border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Order Items
                  </h3>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.product._id || item.product.id} className="flex items-center gap-4">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg bg-background"
                        />

                        <div className="flex-1">
                          <p className="text-text-primary font-medium line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-text-muted">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <p className="text-text-primary font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {placeOrderError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-4">
                    {placeOrderError}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep("payment")}
                    className="flex-1 py-3 border border-border text-text-secondary hover:text-text-primary rounded-lg transition-colors"
                    disabled={isPlacingOrder}
                  >
                    Back
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="flex-1 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPlacingOrder ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === "confirmation" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-surface/50 border border-border rounded-xl"
              >
                <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckIcon className="w-10 h-10 text-green-400" />
                </div>

                <h2 className="text-3xl font-bold text-text-primary mb-4">
                  Order Confirmed!
                </h2>

                <p className="text-text-secondary mb-2">
                  Thank you for your purchase. Your order has been received.
                </p>

                <p className="text-text-primary font-medium mb-8">
                  Order ID: {orderNumber}
                </p>

                <div className="flex justify-center gap-4">
                  <Link
                    to="/shop"
                    className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </Link>

                  <Link
                    to="/profile"
                    className="px-6 py-3 border border-border text-text-secondary hover:text-text-primary rounded-lg transition-colors"
                  >
                    View Order Status
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {currentStep !== "confirmation" && (
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-surface/50 border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="text-text-primary">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Discount</span>
                      <span className="text-green-400">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Shipping</span>
                    <span className="text-text-primary">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Tax (8%)</span>
                    <span className="text-text-primary">{formatPrice(tax)}</span>
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-text-primary">
                        Total
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-text-secondary mb-2">
                    <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium">Secure Checkout</span>
                  </div>
                  <p className="text-xs text-text-muted">
                    Your payment information is encrypted and secure.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}