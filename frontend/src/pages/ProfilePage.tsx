import { useEffect, useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  UserIcon,
  PackageIcon,
  MapPinIcon,
  SettingsIcon,
  LogOutIcon,
  PlusIcon,
  CheckIcon,
  Trash2Icon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { ordersApi } from "../services/orderService";
import { userApi } from "../services/userService";
import type { Address } from "../types";

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

type ProfileSection = "profile" | "orders" | "addresses" | "settings";

interface AddressFormState {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  country: string;
}

const defaultAddressForm = (): AddressFormState => ({
  name: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  phone: "",
  country: "Sri Lanka",
});

const getAddressStorageKey = (userId: string) => `orionx-addresses:${userId}`;

const getPreferenceStorageKey = (userId: string) =>
  `orionx-profile-preferences:${userId}`;

const loadSavedAddresses = (userId: string): Address[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const storedAddresses = localStorage.getItem(getAddressStorageKey(userId));

  if (!storedAddresses) {
    return [];
  }

  try {
    return JSON.parse(storedAddresses) as Address[];
  } catch {
    localStorage.removeItem(getAddressStorageKey(userId));
    return [];
  }
};

export function ProfilePage() {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [initialName, setInitialName] = useState("");
  const [activeSection, setActiveSection] = useState<ProfileSection>("profile");
  const [accountNote, setAccountNote] = useState("");
  const [accountError, setAccountError] = useState("");
  const [accountSaving, setAccountSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [addressForm, setAddressForm] = useState<AddressFormState>(
    defaultAddressForm()
  );
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressMessage, setAddressMessage] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  const addressStorageKey = useMemo(() => {
    return user?.id ? getAddressStorageKey(user.id) : null;
  }, [user?.id]);

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

  useEffect(() => {
    if (user?.name) {
      setFullName(user.name);
      setInitialName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) {
      setSavedAddresses([]);
      setEmailNotifications(true);
      return;
    }

    setSavedAddresses(loadSavedAddresses(user.id));

    const storedPreferences = localStorage.getItem(getPreferenceStorageKey(user.id));
    if (storedPreferences) {
      try {
        const parsed = JSON.parse(storedPreferences) as {
          emailNotifications?: boolean;
        };

        if (typeof parsed.emailNotifications === "boolean") {
          setEmailNotifications(parsed.emailNotifications);
        }
      } catch {
        localStorage.removeItem(getPreferenceStorageKey(user.id));
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !addressStorageKey) {
      return;
    }

    localStorage.setItem(addressStorageKey, JSON.stringify(savedAddresses));
  }, [savedAddresses, addressStorageKey, user?.id]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    localStorage.setItem(
      getPreferenceStorageKey(user.id),
      JSON.stringify({ emailNotifications })
    );
  }, [emailNotifications, user?.id]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
    }).format(price);
  };

  const isNameChanged = fullName.trim() !== initialName.trim();

  const saveProfile = async () => {
    const nextName = fullName.trim();

    if (!nextName) {
      return;
    }

    try {
      setAccountSaving(true);
      setAccountError("");
      setAccountNote("");

      const token = localStorage.getItem("token");

      if (!token) {
        setAccountError("Please login first.");
        return;
      }

      const response = await userApi.updateProfile(nextName, token);
      const updatedName = response.user?.username || nextName;

      updateUser({ name: updatedName });
      setFullName(updatedName);
      setInitialName(updatedName);
      setAccountNote("Profile updated.");
      setTimeout(() => setAccountNote(""), 2500);
    } catch (error: any) {
      console.error("Failed to save profile:", error.response?.data || error.message);
      setAccountError(error.response?.data?.message || "Failed to save profile");
    } finally {
      setAccountSaving(false);
    }
  };

  const saveAddress = () => {
    if (!user) {
      return;
    }

    if (!addressForm.name.trim() || !addressForm.street.trim()) {
      setAddressMessage("Add a contact name and street address first.");
      return;
    }

    setAddressSaving(true);

    const newAddress: Address = {
      id: `${Date.now()}`,
      name: addressForm.name.trim(),
      street: addressForm.street.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      zipCode: addressForm.zipCode.trim(),
      phone: addressForm.phone.trim(),
      isDefault: savedAddresses.length === 0,
    };

    setSavedAddresses((current) => [...current, newAddress]);
    setAddressForm(defaultAddressForm());
    setAddressMessage("Saved address added.");
    setTimeout(() => setAddressMessage(""), 2500);
    setAddressSaving(false);
  };

  const setDefaultAddress = (addressId: string) => {
    setSavedAddresses((current) =>
      current.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      }))
    );
  };

  const removeAddress = (addressId: string) => {
    setSavedAddresses((current) => {
      const nextAddresses = current.filter((address) => address.id !== addressId);

      if (nextAddresses.length > 0 && !nextAddresses.some((address) => address.isDefault)) {
        return nextAddresses.map((address, index) => ({
          ...address,
          isDefault: index === 0,
        }));
      }

      return nextAddresses;
    });
  };

  const visibleOrders = activeSection === "orders" ? orders : orders.slice(0, 5);
  const showOrderViewAll = activeSection === "profile" && orders.length > 5;

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
                <button
                  type="button"
                  onClick={() => setActiveSection("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeSection === "profile"
                      ? "bg-primary/10 text-primary"
                      : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  Profile Details
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeSection === "orders"
                      ? "bg-primary/10 text-primary"
                      : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                  }`}
                >
                  <PackageIcon className="w-5 h-5" />
                  Order History
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection("addresses")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeSection === "addresses"
                      ? "bg-primary/10 text-primary"
                      : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                  }`}
                >
                  <MapPinIcon className="w-5 h-5" />
                  Saved Addresses
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection("settings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeSection === "settings"
                      ? "bg-primary/10 text-primary"
                      : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                  }`}
                >
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
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-text-primary">
                    {activeSection === "profile"
                      ? "Profile Details"
                      : activeSection === "orders"
                        ? "Order History"
                        : activeSection === "addresses"
                          ? "Saved Addresses"
                          : "Account Settings"}
                  </h3>
                  <p className="text-sm text-text-muted mt-1">
                    {activeSection === "profile" &&
                      "Update your display name and identity details."}
                    {activeSection === "orders" &&
                      "Browse recent and previous orders from your account."}
                    {activeSection === "addresses" &&
                      "Manage delivery addresses used at checkout."}
                    {activeSection === "settings" &&
                      "Control account preferences and profile behavior."}
                  </p>
                </div>

                {activeSection === "orders" ? (
                  <button
                    type="button"
                    onClick={() => setActiveSection("orders")}
                    className="text-sm text-primary hover:text-primary-light"
                  >
                    {showOrderViewAll ? "Showing all orders" : "View all"}
                  </button>
                ) : null}
              </div>

              {activeSection === "profile" ? (
                <form className="space-y-6 max-w-2xl" onSubmit={(event) => event.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
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
                    onClick={saveProfile}
                    disabled={!isNameChanged || accountSaving}
                    className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                  >
                    {accountSaving ? "Saving..." : "Save Changes"}
                  </button>

                  {accountNote ? (
                    <p className="text-sm text-green-400">{accountNote}</p>
                  ) : null}

                  {accountError ? (
                    <p className="text-sm text-red-400">{accountError}</p>
                  ) : null}

                  {accountError ? (
                    <p className="text-sm text-red-400">{accountError}</p>
                  ) : null}
                </form>
              ) : null}

              {activeSection === "orders" ? (
                loadingOrders ? (
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
                    {visibleOrders.map((order) => (
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
                )
              ) : null}

              {activeSection === "addresses" ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Contact name"
                      value={addressForm.name}
                      onChange={(event) =>
                        setAddressForm((current) => ({ ...current, name: event.target.value }))
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="Phone number"
                      value={addressForm.phone}
                      onChange={(event) =>
                        setAddressForm((current) => ({ ...current, phone: event.target.value }))
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="Street address"
                      value={addressForm.street}
                      onChange={(event) =>
                        setAddressForm((current) => ({ ...current, street: event.target.value }))
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary md:col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(event) =>
                        setAddressForm((current) => ({ ...current, city: event.target.value }))
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="State / Province"
                      value={addressForm.state}
                      onChange={(event) =>
                        setAddressForm((current) => ({ ...current, state: event.target.value }))
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="ZIP / Postal code"
                      value={addressForm.zipCode}
                      onChange={(event) =>
                        setAddressForm((current) => ({ ...current, zipCode: event.target.value }))
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={addressForm.country}
                      onChange={(event) =>
                        setAddressForm((current) => ({ ...current, country: event.target.value }))
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={saveAddress}
                    disabled={addressSaving}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="w-4 h-4" />
                    {addressSaving ? "Saving..." : "Save Address"}
                  </button>

                  {addressMessage ? (
                    <p className="text-sm text-green-400">{addressMessage}</p>
                  ) : null}

                  {savedAddresses.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
                      <MapPinIcon className="w-12 h-12 text-text-muted mx-auto mb-4" />
                      <p className="text-text-secondary">No saved addresses yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedAddresses.map((address) => (
                        <div
                          key={address.id}
                          className="border border-border rounded-lg p-4 bg-background/40"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <p className="text-text-primary font-semibold">
                                  {address.name}
                                </p>
                                {address.isDefault ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400">
                                    <CheckIcon className="w-3 h-3" />
                                    Default
                                  </span>
                                ) : null}
                              </div>
                              <p className="text-sm text-text-secondary">{address.street}</p>
                              <p className="text-sm text-text-secondary">
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                              <p className="text-sm text-text-secondary">
                                {address.phone}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => setDefaultAddress(address.id)}
                                className="px-4 py-2 rounded-lg bg-surface-elevated text-text-primary text-sm font-medium hover:opacity-90 transition"
                              >
                                Set default
                              </button>
                              <button
                                type="button"
                                onClick={() => removeAddress(address.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-400/10 text-red-300 text-sm font-medium hover:bg-red-400/20 transition"
                              >
                                <Trash2Icon className="w-4 h-4" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              {activeSection === "settings" ? (
                <div className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-text-muted cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 text-text-secondary">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(event) => setEmailNotifications(event.target.checked)}
                      className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary"
                    />
                    Email me order updates and offers
                  </label>

                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={!isNameChanged || accountSaving}
                    className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                  >
                    {accountSaving ? "Saving..." : "Save Account Settings"}
                  </button>

                  {accountNote ? (
                    <p className="text-sm text-green-400">{accountNote}</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}