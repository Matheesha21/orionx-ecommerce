import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5050/api";

export const userApi = {
  addToCart: async (productId: string, qty: number, token: string) => {
    const response = await axios.post(
      `${API_BASE_URL}/users/cart`,
      { productId, qty },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  getCart: async (token: string) => {
    const response = await axios.get(`${API_BASE_URL}/users/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  updateCartItem: async (productId: string, qty: number, token: string) => {
    const response = await axios.put(
      `${API_BASE_URL}/users/cart`,
      { productId, qty },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  removeFromCart: async (productId: string, token: string) => {
    const response = await axios.delete(`${API_BASE_URL}/users/cart/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  addToWishlist: async (productId: string, token: string) => {
    const response = await axios.post(
      `${API_BASE_URL}/users/wishlist`,
      { productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  getWishlist: async (token: string) => {
    const response = await axios.get(`${API_BASE_URL}/users/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  removeFromWishlist: async (productId: string, token: string) => {
    const response = await axios.delete(
      `${API_BASE_URL}/users/wishlist/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};