import { Hotel, InsertHotel, Merchant, InsertMerchant, Product, InsertProduct, Order, InsertOrder, User, InsertUser, Client, InsertClient, HotelMerchant, InsertHotelMerchant } from "@shared/schema";

export interface IStorage {
  // Hotels
  getHotel(id: number): Promise<Hotel | undefined>;
  getHotelByCode(code: string): Promise<Hotel | undefined>;
  getAllHotels(): Promise<Hotel[]>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;
  updateHotel(id: number, hotel: Partial<Hotel>): Promise<Hotel | undefined>;

  // Merchants
  getMerchant(id: number): Promise<Merchant | undefined>;
  getAllMerchants(): Promise<Merchant[]>;
  getMerchantsNearHotel(hotelId: number, radiusKm: number): Promise<Merchant[]>;
  createMerchant(merchant: InsertMerchant): Promise<Merchant>;
  updateMerchant(id: number, merchant: Partial<Merchant>): Promise<Merchant | undefined>;

  // Products
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByMerchant(merchantId: number): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Orders
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  getOrdersByHotel(hotelId: number): Promise<Order[]>;
  getOrdersByMerchant(merchantId: number): Promise<Order[]>;
  getOrdersByCustomer(customerName: string, customerRoom: string): Promise<Order[]>;
  getActiveOrdersByCustomer(customerName: string, customerRoom: string): Promise<Order[]>;
  getOrdersByClient(clientId: number): Promise<Order[]>;
  getActiveOrdersByClient(clientId: number): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<Order>): Promise<Order | undefined>;

  // Clients
  getClient(id: number): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<Client>): Promise<Client | undefined>;
  authenticateClient(email: string, password: string): Promise<Client | undefined>;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | undefined>;

  // Hotel-Merchant associations
  getHotelMerchants(hotelId: number): Promise<HotelMerchant[]>;
  getMerchantHotels(merchantId: number): Promise<HotelMerchant[]>;
  addHotelMerchant(association: InsertHotelMerchant): Promise<HotelMerchant>;
  updateHotelMerchant(hotelId: number, merchantId: number, isActive: boolean): Promise<HotelMerchant | undefined>;
  removeHotelMerchant(hotelId: number, merchantId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private hotels: Map<number, Hotel> = new Map();
  private merchants: Map<number, Merchant> = new Map();
  private products: Map<number, Product> = new Map();
  private orders: Map<number, Order> = new Map();
  private users: Map<number, User> = new Map();
  private clients: Map<number, Client> = new Map();
  private hotelMerchants: Map<number, HotelMerchant> = new Map();
  private currentId = 1;

  constructor() {
    this.seedData();
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    return `ZI${timestamp}`;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private seedData(): void {
    // Seed Hotels
    const hotel1: Hotel = {
      id: this.currentId++,
      name: "Hôtel des Champs-Élysées",
      address: "123 Avenue des Champs-Élysées, 75008 Paris",
      code: "ZI75015",
      latitude: "48.8698679",
      longitude: "2.3072976",
      qrCode: "QR_ZI75015",
      isActive: true,
    };
    this.hotels.set(hotel1.id, hotel1);

    const hotel2: Hotel = {
      id: this.currentId++,
      name: "Le Grand Hôtel",
      address: "2 Rue Scribe, 75009 Paris",
      code: "ZI75001",
      latitude: "48.8708679",
      longitude: "2.3312976",
      qrCode: "QR_ZI75001",
      isActive: true,
    };
    this.hotels.set(hotel2.id, hotel2);

    const hotel3: Hotel = {
      id: this.currentId++,
      name: "Hôtel Marais",
      address: "12 Rue de Rivoli, 75004 Paris",
      code: "ZI75003",
      latitude: "48.8558679",
      longitude: "2.3552976",
      qrCode: "QR_ZI75003",
      isActive: true,
    };
    this.hotels.set(hotel3.id, hotel3);

    // Seed Merchants
    const merchant1: Merchant = {
      id: this.currentId++,
      name: "Souvenirs de Paris",
      address: "45 Rue de Rivoli, 75001 Paris",
      category: "Souvenirs",
      latitude: "48.8718679",
      longitude: "2.3082976",
      rating: "4.8",
      reviewCount: 127,
      isOpen: true,
      imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    };
    this.merchants.set(merchant1.id, merchant1);

    const merchant2: Merchant = {
      id: this.currentId++,
      name: "Art & Craft Paris",
      address: "78 Boulevard Saint-Germain, 75005 Paris",
      category: "Artisanat",
      latitude: "48.8688679",
      longitude: "2.3102976",
      rating: "4.2",
      reviewCount: 89,
      isOpen: true,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    };
    this.merchants.set(merchant2.id, merchant2);

    const merchant3: Merchant = {
      id: this.currentId++,
      name: "Galerie Française",
      address: "25 Rue du Louvre, 75001 Paris",
      category: "Galerie",
      latitude: "48.8638679",
      longitude: "2.3122976",
      rating: "4.9",
      reviewCount: 203,
      isOpen: true,
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    };
    this.merchants.set(merchant3.id, merchant3);

    // Seed Products (Souvenirs)
    const products = [
      { merchantId: merchant1.id, name: "Tour Eiffel Miniature", description: "Réplique authentique de la Tour Eiffel en métal", price: "12.50", category: "Monuments", imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120", isSouvenir: true, origin: "France", material: "Métal" },
      { merchantId: merchant1.id, name: "Magnet Paris", description: "Magnet collector avec vues de Paris", price: "4.90", category: "Magnets", imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120", isSouvenir: true, origin: "France", material: "Céramique" },
      { merchantId: merchant1.id, name: "Porte-clés Louvre", description: "Porte-clés avec la pyramide du Louvre", price: "6.80", category: "Porte-clés", imageUrl: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120", isSouvenir: true, origin: "France", material: "Métal" },
      { merchantId: merchant2.id, name: "Artisanat Local", description: "Poterie artisanale française", price: "24.90", category: "Artisanat", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120", isSouvenir: true, origin: "France", material: "Céramique" },
      { merchantId: merchant2.id, name: "Bijoux Artisanaux", description: "Boucles d'oreilles faites main", price: "18.50", category: "Bijoux", imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120", isSouvenir: true, origin: "France", material: "Argent" },
      { merchantId: merchant3.id, name: "Cartes Postales Vintage", description: "Collection de cartes postales parisiennes", price: "8.80", category: "Papeterie", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120", isSouvenir: true, origin: "France", material: "Papier" },
      { merchantId: merchant3.id, name: "Livre d'Art Paris", description: "Livre photographique sur Paris", price: "29.20", category: "Livres", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120", isSouvenir: true, origin: "France", material: "Papier" },
    ];

    products.forEach(productData => {
      const product: Product = {
        id: this.currentId++,
        merchantId: productData.merchantId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        imageUrl: productData.imageUrl,
        isAvailable: true,
        isSouvenir: productData.isSouvenir,
        origin: productData.origin,
        material: productData.material,
      };
      this.products.set(product.id, product);
    });

    // Seed Clients
    const client1: Client = {
      id: this.currentId++,
      email: "jean.dupont@example.com",
      password: "password123",
      firstName: "Jean",
      lastName: "Dupont",
      phone: "06 12 34 56 78",
      isActive: true,
      hasCompletedTutorial: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.clients.set(client1.id, client1);

    const client2: Client = {
      id: this.currentId++,
      email: "marie.martin@example.com",
      password: "password456",
      firstName: "Marie",
      lastName: "Martin",
      phone: "06 98 76 54 32",
      isActive: true,
      hasCompletedTutorial: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.clients.set(client2.id, client2);

    // Seed Orders
    const order1: Order = {
      id: this.currentId++,
      hotelId: hotel1.id,
      merchantId: merchant1.id,
      clientId: client1.id,
      orderNumber: this.generateOrderNumber(),
      customerName: "Jean Dupont",
      customerRoom: "205",
      items: [
        { productId: 4, productName: "Tour Eiffel Miniature", quantity: 2, price: "12.50" },
        { productId: 5, productName: "Magnet Paris", quantity: 1, price: "4.90" }
      ],
      totalAmount: "29.90",
      status: "delivered",
      merchantCommission: "22.43", // 75%
      zishopCommission: "5.98", // 20%
      hotelCommission: "1.50", // 5%
      deliveryNotes: null,
      confirmedAt: new Date(),
      deliveredAt: new Date(),
      estimatedDelivery: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(order1.id, order1);

    const order2: Order = {
      id: this.currentId++,
      hotelId: hotel1.id,
      merchantId: merchant2.id,
      clientId: client2.id,
      orderNumber: this.generateOrderNumber(),
      customerName: "Marie Martin",
      customerRoom: "312",
      items: [
        { productId: 7, productName: "Artisanat Local", quantity: 1, price: "24.90" }
      ],
      totalAmount: "24.90",
      status: "preparing",
      merchantCommission: "18.68", // 75%
      zishopCommission: "4.98", // 20%
      hotelCommission: "1.25", // 5%
      deliveryNotes: null,
      confirmedAt: new Date(),
      deliveredAt: null,
      estimatedDelivery: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(order2.id, order2);

    // Seed Users
    const admin: User = {
      id: this.currentId++,
      username: "admin",
      password: "admin123",
      role: "admin",
      entityId: null,
    };
    this.users.set(admin.id, admin);

    const hotelUser: User = {
      id: this.currentId++,
      username: "hotel1",
      password: "hotel123",
      role: "hotel",
      entityId: hotel1.id,
    };
    this.users.set(hotelUser.id, hotelUser);

    const merchantUser: User = {
      id: this.currentId++,
      username: "merchant1",
      password: "merchant123",
      role: "merchant",
      entityId: merchant1.id,
    };
    this.users.set(merchantUser.id, merchantUser);

    // Seed Hotel-Merchant associations
    const associations = [
      { hotelId: hotel1.id, merchantId: merchant1.id },
      { hotelId: hotel1.id, merchantId: merchant2.id },
      { hotelId: hotel1.id, merchantId: merchant3.id },
      { hotelId: hotel2.id, merchantId: merchant1.id },
      { hotelId: hotel2.id, merchantId: merchant3.id },
      { hotelId: hotel3.id, merchantId: merchant2.id },
      { hotelId: hotel3.id, merchantId: merchant3.id },
    ];

    associations.forEach(({ hotelId, merchantId }) => {
      const association: HotelMerchant = {
        id: this.currentId++,
        hotelId,
        merchantId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.hotelMerchants.set(association.id, association);
    });
  }

  // Hotel methods
  async getHotel(id: number): Promise<Hotel | undefined> {
    return this.hotels.get(id);
  }

  async getHotelByCode(code: string): Promise<Hotel | undefined> {
    return Array.from(this.hotels.values()).find(hotel => hotel.code === code);
  }

  async getAllHotels(): Promise<Hotel[]> {
    return Array.from(this.hotels.values());
  }

  async createHotel(insertHotel: InsertHotel): Promise<Hotel> {
    const id = this.currentId++;
    const qrCode = `QR_${insertHotel.code}`;
    const hotel: Hotel = { ...insertHotel, id, qrCode, isActive: true };
    this.hotels.set(id, hotel);
    return hotel;
  }

  async updateHotel(id: number, updates: Partial<Hotel>): Promise<Hotel | undefined> {
    const hotel = this.hotels.get(id);
    if (!hotel) return undefined;
    const updatedHotel = { ...hotel, ...updates };
    this.hotels.set(id, updatedHotel);
    return updatedHotel;
  }

  // Merchant methods
  async getMerchant(id: number): Promise<Merchant | undefined> {
    return this.merchants.get(id);
  }

  async getAllMerchants(): Promise<Merchant[]> {
    return Array.from(this.merchants.values());
  }

  async getMerchantsNearHotel(hotelId: number, radiusKm: number = 3): Promise<Merchant[]> {
    const hotel = await this.getHotel(hotelId);
    if (!hotel) return [];

    const hotelLat = parseFloat(hotel.latitude);
    const hotelLon = parseFloat(hotel.longitude);

    return Array.from(this.merchants.values()).filter(merchant => {
      const merchantLat = parseFloat(merchant.latitude);
      const merchantLon = parseFloat(merchant.longitude);
      const distance = this.calculateDistance(hotelLat, hotelLon, merchantLat, merchantLon);
      return distance <= radiusKm;
    });
  }

  async createMerchant(insertMerchant: InsertMerchant): Promise<Merchant> {
    const id = this.currentId++;
    const merchant: Merchant = { 
      ...insertMerchant, 
      id,
      rating: insertMerchant.rating || "0.0",
      reviewCount: insertMerchant.reviewCount || 0,
      isOpen: insertMerchant.isOpen !== undefined ? insertMerchant.isOpen : true,
      imageUrl: insertMerchant.imageUrl || null
    };
    this.merchants.set(id, merchant);
    return merchant;
  }

  async updateMerchant(id: number, updates: Partial<Merchant>): Promise<Merchant | undefined> {
    const merchant = this.merchants.get(id);
    if (!merchant) return undefined;
    const updatedMerchant = { ...merchant, ...updates };
    this.merchants.set(id, updatedMerchant);
    return updatedMerchant;
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByMerchant(merchantId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.merchantId === merchantId);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      description: insertProduct.description || null,
      imageUrl: insertProduct.imageUrl || null,
      isAvailable: insertProduct.isAvailable !== undefined ? insertProduct.isAvailable : true,
      isSouvenir: insertProduct.isSouvenir !== undefined ? insertProduct.isSouvenir : false,
      origin: insertProduct.origin || null,
      material: insertProduct.material || null
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(order => order.orderNumber === orderNumber);
  }

  async getOrdersByHotel(hotelId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.hotelId === hotelId);
  }

  async getOrdersByMerchant(merchantId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.merchantId === merchantId);
  }

  async getOrdersByCustomer(customerName: string, customerRoom: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.customerName === customerName && order.customerRoom === customerRoom);
  }

  async getActiveOrdersByCustomer(customerName: string, customerRoom: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => 
      order.customerName === customerName && 
      order.customerRoom === customerRoom && 
      !["delivered", "cancelled", "refunded"].includes(order.status)
    );
  }

  async getOrdersByClient(clientId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.clientId === clientId);
  }

  async getActiveOrdersByClient(clientId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => 
      order.clientId === clientId && 
      !["delivered", "cancelled", "refunded"].includes(order.status)
    );
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentId++;
    const orderNumber = this.generateOrderNumber();
    const totalAmount = parseFloat(insertOrder.totalAmount);
    const order: Order = {
      id,
      hotelId: insertOrder.hotelId,
      merchantId: insertOrder.merchantId,
      clientId: insertOrder.clientId || null,
      orderNumber,
      customerName: insertOrder.customerName,
      customerRoom: insertOrder.customerRoom,
      items: insertOrder.items,
      totalAmount: insertOrder.totalAmount,
      status: insertOrder.status || "pending",
      merchantCommission: (totalAmount * 0.75).toFixed(2),
      zishopCommission: (totalAmount * 0.20).toFixed(2),
      hotelCommission: (totalAmount * 0.05).toFixed(2),
      deliveryNotes: insertOrder.deliveryNotes || null,
      confirmedAt: insertOrder.confirmedAt || null,
      deliveredAt: insertOrder.deliveredAt || null,
      estimatedDelivery: insertOrder.estimatedDelivery || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: number, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const updatedOrder = { ...order, ...updates, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Client methods
  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find(client => client.email === email);
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.currentId++;
    const client: Client = { 
      ...insertClient, 
      id,
      isActive: true,
      hasCompletedTutorial: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: number, updates: Partial<Client>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    const updatedClient = { ...client, ...updates, updatedAt: new Date() };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async authenticateClient(email: string, password: string): Promise<Client | undefined> {
    const client = await this.getClientByEmail(email);
    if (client && client.password === password) {
      return client;
    }
    return undefined;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      entityId: insertUser.entityId || null
    };
    this.users.set(id, user);
    return user;
  }

  async authenticateUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return undefined;
  }

  // Hotel-Merchant associations
  async getHotelMerchants(hotelId: number): Promise<HotelMerchant[]> {
    return Array.from(this.hotelMerchants.values()).filter(hm => hm.hotelId === hotelId && hm.isActive);
  }

  async getMerchantHotels(merchantId: number): Promise<HotelMerchant[]> {
    return Array.from(this.hotelMerchants.values()).filter(hm => hm.merchantId === merchantId && hm.isActive);
  }

  async addHotelMerchant(association: InsertHotelMerchant): Promise<HotelMerchant> {
    const id = this.currentId++;
    const hotelMerchant: HotelMerchant = {
      id,
      hotelId: association.hotelId,
      merchantId: association.merchantId,
      isActive: association.isActive !== undefined ? association.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.hotelMerchants.set(id, hotelMerchant);
    return hotelMerchant;
  }

  async updateHotelMerchant(hotelId: number, merchantId: number, isActive: boolean): Promise<HotelMerchant | undefined> {
    const association = Array.from(this.hotelMerchants.values()).find(
      hm => hm.hotelId === hotelId && hm.merchantId === merchantId
    );
    if (!association) return undefined;
    association.isActive = isActive;
    association.updatedAt = new Date();
    return association;
  }

  async removeHotelMerchant(hotelId: number, merchantId: number): Promise<boolean> {
    const association = Array.from(this.hotelMerchants.entries()).find(
      ([_, hm]) => hm.hotelId === hotelId && hm.merchantId === merchantId
    );
    if (!association) return false;
    return this.hotelMerchants.delete(association[0]);
  }
}

export const storage = new MemStorage();
