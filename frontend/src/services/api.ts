import axios from 'axios';
import type { 
  User, 
  Product, 
  Category, 
  CartItem, 
  Order,
  LoginCredentials,
  RegisterData,
  AuthResponse
} from '../types';

const userApi = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const productApi = axios.create({
  baseURL: 'http://localhost:8001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
const addAuthHeader = (config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

userApi.interceptors.request.use(addAuthHeader);
productApi.interceptors.request.use(addAuthHeader);

// Auth Service
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await userApi.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', data.access_token);
    return data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await userApi.post<AuthResponse>('/auth/register', userData);
    localStorage.setItem('token', data.access_token);
    return data;
  },

  async logout() {
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await userApi.get<User>('/users/me');
    return data;
  }
};

// Product Service
export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data } = await productApi.get<Product[]>('/products');
    return data;
  },

  async getProduct(id: number): Promise<Product> {
    const { data } = await productApi.get<Product>(`/products/${id}`);
    return data;
  },

  async getCategories(): Promise<Category[]> {
    const { data } = await productApi.get<Category[]>('/categories');
    return data;
  }
};

// Cart Service
export const cartService = {
  async getCart(): Promise<CartItem[]> {
    const { data } = await productApi.get<CartItem[]>('/cart');
    return data;
  },

  async addToCart(productId: number, quantity: number): Promise<CartItem> {
    const { data } = await productApi.post<CartItem>('/cart/items', { product_id: productId, quantity });
    return data;
  },

  async updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
    const { data } = await productApi.put<CartItem>(`/cart/items/${itemId}`, { quantity });
    return data;
  },

  async removeFromCart(itemId: number): Promise<void> {
    await productApi.delete(`/cart/items/${itemId}`);
  }
};

// Order Service
export const orderService = {
  async createOrder(): Promise<Order> {
    const { data } = await productApi.post<Order>('/orders');
    return data;
  },

  async getOrders(): Promise<Order[]> {
    const { data } = await productApi.get<Order[]>('/orders');
    return data;
  },

  async getOrder(id: number): Promise<Order> {
    const { data } = await productApi.get<Order>(`/orders/${id}`);
    return data;
  }
}; 