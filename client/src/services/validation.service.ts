import { api } from '@/lib/api';
import { AdminProductValidation, AdminMerchantValidation, AdminHotelValidation } from '@/types';

class ValidationService {
  // Validation des produits
  async validateProduct(validation: AdminProductValidation) {
    try {
      const response = await api.post('/api/admin/products/validate', validation);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la validation du produit:', error);
      throw error;
    }
  }

  // Validation des commerçants
  async validateMerchant(validation: AdminMerchantValidation) {
    try {
      const response = await api.post('/api/admin/merchants/validate', validation);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la validation du commerçant:', error);
      throw error;
    }
  }

  // Validation des hôtels
  async validateHotel(validation: AdminHotelValidation) {
    try {
      const response = await api.post('/api/admin/hotels/validate', validation);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la validation de l\'hôtel:', error);
      throw error;
    }
  }

  // Récupérer les produits en attente de validation
  async getPendingProducts() {
    try {
      const response = await api.get('/api/admin/products/pending');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits en attente:', error);
      throw error;
    }
  }

  // Récupérer les commerçants en attente de validation
  async getPendingMerchants() {
    try {
      const response = await api.get('/api/admin/merchants/pending');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des commerçants en attente:', error);
      throw error;
    }
  }

  // Récupérer les hôtels en attente de validation
  async getPendingHotels() {
    try {
      const response = await api.get('/api/admin/hotels/pending');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des hôtels en attente:', error);
      throw error;
    }
  }
}

export const validationService = new ValidationService(); 