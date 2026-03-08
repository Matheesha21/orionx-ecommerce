/**
 * ORIONX API Service Layer
 *
 * This module provides typed API functions for all backend endpoints.
 * Currently uses mock data as a fallback — when your backend is ready,
 * simply update API_BASE_URL and set USE_MOCK_DATA to false.
 *
 * SETUP:
 * 1. Set your backend URL in API_BASE_URL
 * 2. Set USE_MOCK_DATA = false
 * 3. All components using these functions will automatically connect to your API
 */

import {
  Product,
  Category,
  User,
  Review,
  Order,
  CouponCode,
  ApiResponse,
  PaginatedResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ProductFilters,
  ContactFormData,
  QuotationRequest,
  OrderRequest } from
'../types';

// ─── Configuration ───────────────────────────────────────────
// Change this to your backend URL when ready
export const API_BASE_URL = 'http://localhost:5050/api';

// Set to false when your backend is running
export const USE_MOCK_DATA = true;

// ─── Token Management ────────────────────────────────────────
const TOKEN_KEY = 'orionx-token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── HTTP Client ─────────────────────────────────────────────
async function request<T>(
endpoint: string,
options: RequestInit = {})
: Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP ${response.status}: ${response.statusText}`
    }));
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}

// ─── Auth API ────────────────────────────────────────────────
export const authApi = {
  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  register: (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  getProfile: (): Promise<ApiResponse<User>> => request('/auth/profile'),

  updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> =>
  request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

// ─── Products API ────────────────────────────────────────────
export const productsApi = {
  getAll: (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },

  getBySlug: (slug: string): Promise<ApiResponse<Product>> =>
  request(`/products/slug/${slug}`),

  getById: (id: string): Promise<ApiResponse<Product>> =>
  request(`/products/${id}`),

  getFeatured: (): Promise<ApiResponse<Product[]>> =>
  request('/products/featured'),

  getOnSale: (): Promise<ApiResponse<Product[]>> =>
  request('/products/on-sale'),

  getRelated: (
  productId: string,
  limit?: number)
  : Promise<ApiResponse<Product[]>> =>
  request(`/products/${productId}/related${limit ? `?limit=${limit}` : ''}`),

  search: (query: string): Promise<ApiResponse<Product[]>> =>
  request(`/products/search?q=${encodeURIComponent(query)}`)
};

// ─── Categories API ──────────────────────────────────────────
export const categoriesApi = {
  getAll: (): Promise<ApiResponse<Category[]>> => request('/categories'),

  getBySlug: (slug: string): Promise<ApiResponse<Category>> =>
  request(`/categories/${slug}`)
};

// ─── Reviews API ─────────────────────────────────────────────
export const reviewsApi = {
  getByProduct: (productId: string): Promise<ApiResponse<Review[]>> =>
  request(`/products/${productId}/reviews`),

  create: (
  productId: string,
  data: {rating: number;title: string;comment: string;})
  : Promise<ApiResponse<Review>> =>
  request(`/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

// ─── Orders API ──────────────────────────────────────────────
export const ordersApi = {
  create: (data: OrderRequest): Promise<ApiResponse<Order>> =>
  request('/orders', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  getAll: (): Promise<ApiResponse<Order[]>> => request('/orders'),

  getById: (id: string): Promise<ApiResponse<Order>> =>
  request(`/orders/${id}`)
};

// ─── Coupons API ─────────────────────────────────────────────
export const couponsApi = {
  validate: (code: string): Promise<ApiResponse<CouponCode>> =>
  request(`/coupons/validate`, {
    method: 'POST',
    body: JSON.stringify({ code })
  })
};

// ─── Contact API ─────────────────────────────────────────────
export const contactApi = {
  submit: (data: ContactFormData): Promise<ApiResponse<{id: string;}>> =>
  request('/contact', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

// ─── Quotation API ───────────────────────────────────────────
export const quotationApi = {
  submit: (
  data: QuotationRequest)
  : Promise<ApiResponse<{id: string;referenceNumber: string;}>> =>
  request('/quotations', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  getAll: (): Promise<ApiResponse<QuotationRequest[]>> =>
  request('/quotations')
};