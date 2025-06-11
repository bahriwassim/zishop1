export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  merchantId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  rejectionReason?: string;
}

export interface Merchant {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  rejectionReason?: string;
  products: Product[];
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  rejectionReason?: string;
  qrCode: string;
  merchants: Merchant[];
}

export interface AdminProductValidation {
  productId: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
  validatedAt: Date;
  validatedBy: string;
}

export interface AdminMerchantValidation {
  merchantId: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
  validatedAt: Date;
  validatedBy: string;
}

export interface AdminHotelValidation {
  hotelId: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
  validatedAt: Date;
  validatedBy: string;
} 