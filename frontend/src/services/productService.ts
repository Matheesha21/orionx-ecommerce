import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5050/api";

export interface CreateProductPayload {
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription?: string;
  specs?: Record<string, string>;
  images: string[];
  stockCount: number;
  isFeatured?: boolean;
  isOnSale?: boolean;
  discountPercentage?: number;
  tags?: string[];
}

export const productsApi = {
  getAll: async (params?: any) => {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params,
    });
    return response.data;
  },

  create: async (productData: CreateProductPayload, token: string) => {
    const response = await axios.post(`${API_BASE_URL}/products`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  delete: async (productId: string, token: string) => {
    const response = await axios.delete(`${API_BASE_URL}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  update: async (productId: string, data: any, token: string) => {
  const response = await axios.put(
    `${API_BASE_URL}/products/${productId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
},

  uploadImage: async (file: File, token: string) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(`${API_BASE_URL}/uploads`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};