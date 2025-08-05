import { apiRequest } from "./queryClient";
import type { Hotel, Merchant, Product, Order, InsertOrder, Client, InsertClient } from "@shared/schema";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { AdminProductValidation, AdminMerchantValidation, AdminHotelValidation } from '@/types';

const API_URL = 'http://localhost:5000/api';

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

async function fetchWithErrorHandling(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    
    // Vérifier le content-type
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // Si ce n'est pas du JSON, c'est probablement une erreur HTML
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 200));
      
      if (text.includes("<!DOCTYPE") || text.includes("<html")) {
        throw new Error("Le serveur n'est pas accessible. Veuillez vérifier que le serveur backend est démarré.");
      }
      throw new Error("Réponse invalide du serveur");
    }
    
    if (!response.ok) {
      const error = await response.json();
      console.error("API Error:", error);
      
      // Créer une erreur avec les détails de la réponse
      const apiError = new Error(error.message || `HTTP error! status: ${response.status}`);
      (apiError as any).response = { data: error, status: response.status };
      throw apiError;
    }
    
    return response;
  } catch (error: any) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Impossible de se connecter au serveur. Vérifiez que le serveur est démarré sur le port 5000.");
    }
    throw error;
  }
}

export const api = {
  // Hotels
  getHotels: (): Promise<Hotel[]> =>
    axiosInstance.get('/hotels').then(res => res.data),
  
  getHotelByCode: (code: string): Promise<Hotel> =>
    axiosInstance.get(`/hotels/code/${code}`).then(res => res.data),

  createHotel: (hotel: any): Promise<Hotel> =>
    axiosInstance.post('/hotels', hotel).then(res => res.data),

  updateHotel: (id: number, updates: any): Promise<Hotel> =>
    axiosInstance.put(`/hotels/${id}`, updates).then(res => res.data),

  deleteHotel: (id: number): Promise<void> =>
    axiosInstance.delete(`/hotels/${id}`).then(() => {}),

  // Merchants
  getMerchantsNearHotel: (hotelId: number, radius: number = 3): Promise<Merchant[]> =>
    axiosInstance.get(`/merchants/near/${hotelId}?radius=${radius}`).then(res => res.data),

  getAllMerchants: (): Promise<Merchant[]> =>
    axiosInstance.get('/merchants').then(res => res.data),

  createMerchant: (merchant: any): Promise<Merchant> =>
    axiosInstance.post('/merchants', merchant).then(res => res.data),

  updateMerchant: (id: number, updates: any): Promise<Merchant> =>
    axiosInstance.put(`/merchants/${id}`, updates).then(res => res.data),

  deleteMerchant: (id: number): Promise<void> =>
    axiosInstance.delete(`/merchants/${id}`).then(() => {}),

  // Products
  getProductsByMerchant: (merchantId: number): Promise<Product[]> =>
    axiosInstance.get(`/products/merchant/${merchantId}`).then(res => res.data),

  getAllProducts: (): Promise<Product[]> =>
    axiosInstance.get('/products').then(res => res.data),

  createProduct: (product: any): Promise<Product> =>
    axiosInstance.post('/products', product).then(res => res.data),

  updateProduct: (id: number, updates: any): Promise<Product> =>
    axiosInstance.put(`/products/${id}`, updates).then(res => res.data),

  deleteProduct: (id: number): Promise<void> =>
    axiosInstance.delete(`/products/${id}`).then(() => {}),

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
    axiosInstance.post("/orders", order).then(res => res.data),

  updateOrder: (id: number, updates: any): Promise<Order> =>
    axiosInstance.put(`/orders/${id}`, updates).then(res => res.data),

  updateOrderStatus: (id: number, status: string): Promise<Order> =>
    axiosInstance.put(`/orders/${id}`, { status }).then(res => res.data),

  // Workflow et commission endpoints
  getOrderWorkflow: (): Promise<any> =>
    axiosInstance.get('/orders/workflow').then(res => res.data),

  getCommissionStats: (period: "today" | "week" | "month" = "today"): Promise<any> =>
    axiosInstance.get(`/orders/commissions/stats?period=${period}`).then(res => res.data),

  // Client-specific methods
  getOrdersByCustomer: (customerName: string, customerRoom: string): Promise<Order[]> =>
    axiosInstance.get('/orders').then(res => res.data).then((orders: Order[]) => 
      orders.filter(order => 
        order.customer_name === customerName && 
        order.customer_room === customerRoom
      )
    ),

  getActiveOrdersByCustomer: (customerName: string, customerRoom: string): Promise<Order[]> =>
    axiosInstance.get('/orders').then(res => res.data).then((orders: Order[]) => 
      orders.filter(order => 
        order.customer_name === customerName && 
        order.customer_room === customerRoom &&
        order.status !== 'delivered'
      )
    ),

  getOrdersByClient: (clientId: number): Promise<Order[]> =>
    axiosInstance.get(`/orders/client/${clientId}`).then(res => res.data),

  getActiveOrdersByClient: (clientId: number): Promise<Order[]> =>
    axiosInstance.get(`/orders/client/${clientId}/active`).then(res => res.data),

  // Client authentication and management
  async login(email: string, password: string) {
    console.log("API Login attempt:", { email });
    const response = await axiosInstance.post('/clients/login', { email, password });
    const data = response.data;
    console.log("API Login response:", data);
    
    // Return the client data directly with token
    if (data.client && data.token) {
      localStorage.setItem('token', data.token);
      return { ...data.client, token: data.token };
    }
    return data;
  },

  registerClient: (clientData: InsertClient): Promise<Client> =>
    axiosInstance.post('/clients/register', clientData).then(res => res.data),

  getClient: (id: number): Promise<Client> =>
    axiosInstance.get(`/clients/${id}`).then(res => res.data),

  updateClient: (id: number, updates: Partial<Client>): Promise<Client> =>
    axiosInstance.put(`/clients/${id}`, updates).then(res => res.data),

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
        const orderDate = new Date(order.created_at);
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
