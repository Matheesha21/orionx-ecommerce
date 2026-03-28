import React, { useState, Fragment, ComponentType, useEffect } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  CheckIcon,
  CreditCardIcon,
  TruckIcon,
  ClipboardCheckIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { CheckoutFormData } from "../types";
import { ordersApi } from "../services/orderService";
import { userApi } from "../services/userService";

type Step = "shipping" | "payment" | "review" | "confirmation";

type CartProduct = {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  stockCount: number;
  images: string[];
};

type CartItem = {
  product: CartProduct;
  quantity: number;
};

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");

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

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setCartLoading(true);
        setCartError("");

        const token = localStorage.getItem("token");
        if (!token) {
          setCartError("Please login first");
          return;
        }

        const response = await userApi.getCart(token);

        const mappedItems = (response.cart || [])
          .filter((item: any) => item.product)
          .map((item: any) => ({
            product: {
              ...item.product,
              id: item.product.id || item.product._id,
            },
            quantity: item.quantity,
          }));

        setCartItems(mappedItems);
      } catch (error: any) {
        console.error("Failed to load checkout cart:", error.response?.data || error.message);
        setCartError(error.response?.data?.message || "Failed to load cart");
      } finally {
        setCartLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartLoading(false);
    }
  }, [isAuthenticated]);

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

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading checkout...
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-400">{cartError}</div>
      </div>
    );
  }

  if (cartItems.length === 0 && currentStep !== "confirmation") {
    return <Navigate to="/cart" replace />;
  }

  const subtotal = cartItems.reduce(
  (sum, item) => sum + item.product.price * item.quantity,
  0
  );  

  const discount = 0;
  const shipping = subtotal > 100 ? 0 : cartItems.length > 0 ? 15 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

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

      const orderItems = cartItems.map((item) => ({
        product: item.product.id || item.product._id,
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

      for (const item of cartItems) {
        await userApi.removeFromCart(item.product.id || item.product._id, token);
      }

      setCartItems([]);
      setOrderNumber(createdOrder._id || `ORX-${Date.now().toString(36).toUpperCase()}`);
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
                        value={formData.shipping.firstName}
                        onChange={(e) => updateShipping("firstName", e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.shipping.lastName}
                        onChange={(e) => updateShipping("lastName", e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.shipping.email}
                      onChange={(e) => updateShipping("email", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={formData.shipping.phone}
                      onChange={(e) => updateShipping("phone", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.shipping.address}
                      onChange={(e) => updateShipping("address", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.shipping.city}
                        onChange={(e) => updateShipping("city", e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        State / Country
                      </label>
                      <input
                        type="text"
                        value={formData.shipping.state}
                        onChange={(e) => updateShipping("state", e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={formData.shipping.zipCode}
                        onChange={(e) => updateShipping("zipCode", e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-4 px-6 py-3 bg-primary text-white rounded-lg font-semibold"
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
                      value={formData.payment.cardNumber}
                      onChange={(e) => updatePayment("cardNumber", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={formData.payment.cardName}
                      onChange={(e) => updatePayment("cardName", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={formData.payment.expiry}
                        onChange={(e) => updatePayment("expiry", e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={formData.payment.cvv}
                        onChange={(e) => updatePayment("cvv", e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-4 px-6 py-3 bg-primary text-white rounded-lg font-semibold"
                  >
                    Continue to Review
                  </button>
                </form>
              </motion.div>
            )}

            {currentStep === "review" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-surface/50 border border-border rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold text-text-primary mb-6">
                  Review Your Order
                </h2>

                {placeOrderError && (
                  <div className="mb-4 text-red-400">{placeOrderError}</div>
                )}

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id || item.product._id}
                      className="flex items-center justify-between border-b border-border pb-4"
                    >
                      <div>
                        <p className="text-text-primary font-medium">{item.product.name}</p>
                        <p className="text-sm text-text-secondary">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-text-primary font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold disabled:opacity-60"
                >
                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </button>
              </motion.div>
            )}

            {currentStep === "confirmation" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface/50 border border-border rounded-xl p-8 text-center"
              >
                <ShieldCheckIcon className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Order Placed Successfully
                </h2>
                <p className="text-text-secondary mb-2">
                  Your order number is:
                </p>
                <p className="text-lg font-semibold text-primary mb-6">
                  {orderNumber}
                </p>

                <div className="flex gap-4 justify-center">
                  <Link
                    to="/profile"
                    className="px-6 py-3 bg-primary text-white rounded-lg font-semibold"
                  >
                    View Orders
                  </Link>

                  <Link
                    to="/shop"
                    className="px-6 py-3 border border-border rounded-lg font-semibold text-text-primary"
                  >
                    Continue Shopping
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

                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id || item.product._id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-text-secondary">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="text-text-primary">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border mt-6 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="text-text-primary">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Shipping</span>
                    <span className="text-text-primary">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Tax</span>
                    <span className="text-text-primary">{formatPrice(tax)}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span className="text-text-primary">Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}