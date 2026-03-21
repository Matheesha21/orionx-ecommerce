import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5050/api";

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderPayload {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

export const ordersApi = {
  create: async (orderData: CreateOrderPayload, token: string) => {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  getMyOrders: async (token: string) => {
    const response = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  getById: async (orderId: string, token: string) => {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};