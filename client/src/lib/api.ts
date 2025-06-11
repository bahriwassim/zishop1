import { apiRequest } from "./queryClient";
import type { Hotel, Merchant, Product, Order, InsertOrder, Client, InsertClient } from "@shared/schema";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { AdminProductValidation, AdminMerchantValidation, AdminHotelValidation } from '@/types';

const API_URL = 'http://localhost:3000/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Hotels
  getHotels: (): Promise<Hotel[]> =>
    axiosInstance.get('/hotels').then(res => res.data),
  
  getHotelByCode: (code: string): Promise<Hotel> =>
    axiosInstance.get(`/hotels/${code}`).then(res => res.data),

  // Merchants
  getMerchantsNearHotel: (hotelId: number, radius: number = 3): Promise<Merchant[]> =>
    axiosInstance.get(`/merchants/near/${hotelId}?radius=${radius}`).then(res => res.data),

  // Products
  getProductsByMerchant: (merchantId: number): Promise<Product[]> =>
    axiosInstance.get(`/products/merchant/${merchantId}`).then(res => res.data),

  getAllProducts: (): Promise<Product[]> =>
    axiosInstance.get('/products').then(res => res.data),

  createProduct: (product: any): Promise<Product> =>
    apiRequest("POST", "/products", product).then((res) => res.json()),

  updateProduct: (id: number, updates: any): Promise<Product> =>
    apiRequest("PUT", `/products/${id}`, updates).then((res) => res.json()),

  deleteProduct: (id: number): Promise<void> =>
    apiRequest("DELETE", `/products/${id}`).then(() => {}),

  // Orders
  getOrdersByHotel: (hotelId: number): Promise<Order[]> =>
    axiosInstance.get(`/orders/hotel/${hotelId}`).then(res => res.data),

  getOrdersByMerchant: (merchantId: number): Promise<Order[]> =>
    axiosInstance.get(`/orders/merchant/${merchantId}`).then(res => res.data),

  getAllOrders: (): Promise<Order[]> =>
    axiosInstance.get('/orders').then(res => res.data),

  getOrder: (id: number): Promise<Order> =>
    axiosInstance.get(`/orders/${id}`).then(res => res.data),

  createOrder: (order: InsertOrder): Promise<Order> =>
    apiRequest("POST", "/orders", order).then((res) => res.json()),

  updateOrder: (id: number, updates: any): Promise<Order> =>
    apiRequest("PUT", `/orders/${id}`, updates).then((res) => res.json()),

  updateOrderStatus: (id: number, status: string): Promise<Order> =>
    apiRequest("PUT", `/orders/${id}`, { status }).then((res) => res.json()),

  // Workflow et commission endpoints
  getOrderWorkflow: (): Promise<any> =>
    axiosInstance.get('/orders/workflow').then(res => res.data),

  getCommissionStats: (period: "today" | "week" | "month" = "today"): Promise<any> =>
    axiosInstance.get(`/orders/commissions/stats?period=${period}`).then(res => res.data),

  // Client-specific methods
  getOrdersByCustomer: (customerName: string, customerRoom: string): Promise<Order[]> =>
    axiosInstance.get('/orders').then(res => res.data).then((orders: Order[]) => 
      orders.filter(order => 
        order.customerName === customerName && 
        order.customerRoom === customerRoom
      )
    ),

  getActiveOrdersByCustomer: (customerName: string, customerRoom: string): Promise<Order[]> =>
    axiosInstance.get('/orders').then(res => res.data).then((orders: Order[]) => 
      orders.filter(order => 
        order.customerName === customerName && 
        order.customerRoom === customerRoom &&
        order.status !== 'delivered'
      )
    ),

  getOrdersByClient: (clientId: number): Promise<Order[]> =>
    axiosInstance.get(`/orders/client/${clientId}`).then(res => res.data),

  getActiveOrdersByClient: (clientId: number): Promise<Order[]> =>
    axiosInstance.get(`/orders/client/${clientId}/active`).then(res => res.data),

  // Client authentication and management
  loginClient: (email: string, password: string): Promise<Client> =>
    apiRequest("POST", "/clients/login", { email, password }).then((res) => res.json()),

  registerClient: (clientData: InsertClient): Promise<Client> =>
    apiRequest("POST", "/clients/register", clientData).then((res) => res.json()),

  getClient: (id: number): Promise<Client> =>
    axiosInstance.get(`/clients/${id}`).then(res => res.data),

  updateClient: (id: number, updates: Partial<Client>): Promise<Client> =>
    apiRequest("PUT", `/clients/${id}`, updates).then((res) => res.json()),

  getClientStats: (clientId: number): Promise<any> =>
    axiosInstance.get(`/clients/${clientId}/stats`).then(res => res.data),

  // Statistics
  getHotelStats: (hotelId: number): Promise<any> =>
    axiosInstance.get(`/stats/hotel/${hotelId}`).then(res => res.data),

  getMerchantStats: (merchantId: number): Promise<any> =>
    axiosInstance.get(`/stats/merchant/${merchantId}`).then(res => res.data),

  getAdminStats: (): Promise<any> =>
    axiosInstance.get('/stats/admin').then(res => res.data),

  // Nouvelles méthodes pour le suivi avancé des commandes
  getOrdersWithCommissions: (): Promise<Order[]> =>
    axiosInstance.get('/orders').then(res => res.data),

  getOrdersByStatus: (status: string): Promise<Order[]> =>
    axiosInstance.get('/orders').then(res => res.data).then((orders: Order[]) => 
      orders.filter(order => order.status === status)
    ),

  getOrdersByDateRange: (startDate: string, endDate: string): Promise<Order[]> =>
    axiosInstance.get('/orders').then(res => res.data).then((orders: Order[]) => 
      orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
      })
    ),

  // Méthodes pour la gestion des notifications (à implémenter)
  getNotifications: (userId: number, userType: string): Promise<any[]> =>
    Promise.resolve([]), // Placeholder pour les notifications

  markNotificationAsRead: (notificationId: number): Promise<void> =>
    Promise.resolve(), // Placeholder pour marquer comme lu

  // Nouvelles méthodes pour la validation
  validateProduct: (validation: AdminProductValidation) => 
    axiosInstance.post('/admin/products/validate', validation).then(res => res.data),

  validateMerchant: (validation: AdminMerchantValidation) => 
    axiosInstance.post('/admin/merchants/validate', validation).then(res => res.data),

  validateHotel: (validation: AdminHotelValidation) => 
    axiosInstance.post('/admin/hotels/validate', validation).then(res => res.data),

  getPendingProducts: () => 
    axiosInstance.get('/admin/products/pending').then(res => res.data),

  getPendingMerchants: () => 
    axiosInstance.get('/admin/merchants/pending').then(res => res.data),

  getPendingHotels: () => 
    axiosInstance.get('/admin/hotels/pending').then(res => res.data),
};
