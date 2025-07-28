import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { hotels, merchants, products, orders, clients, users, hotelMerchants } from "../shared/schema";
import { insertHotelSchema, insertMerchantSchema, insertProductSchema, insertClientSchema, insertUserSchema } from "../shared/schema";

// Configuration pour une base de données locale de test
const connectionString = "postgresql://postgres:password@localhost:5432/zishop_test";
const client = postgres(connectionString, {
  ssl: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10
});

export const db = drizzle(client);

// Interface de stockage simplifiée pour les tests
interface ITestStorage {
  createHotel(hotel: any): Promise<any>;
  createMerchant(merchant: any): Promise<any>;
  createUser(user: any): Promise<any>;
  createClient(client: any): Promise<any>;
  createProduct(product: any): Promise<any>;
  createOrder(order: any): Promise<any>;
  addHotelMerchant(association: any): Promise<any>;
  getHotel(id: number): Promise<any>;
  getMerchant(id: number): Promise<any>;
  getProduct(id: number): Promise<any>;
  getOrder(id: number): Promise<any>;
  getAllHotels(): Promise<any[]>;
  getAllMerchants(): Promise<any[]>;
  getAllProducts(): Promise<any[]>;
  getAllOrders(): Promise<any[]>;
  getAllClients(): Promise<any[]>;
  getAllUsers(): Promise<any[]>;
  getHotelMerchants(hotelId: number): Promise<any[]>;
  getMerchantHotels(merchantId: number): Promise<any[]>;
}

class TestStorage implements ITestStorage {
  async createHotel(hotel: any): Promise<any> {
    const result = await db.insert(hotels).values(hotel).returning();
    return result[0];
  }

  async createMerchant(merchant: any): Promise<any> {
    const result = await db.insert(merchants).values(merchant).returning();
    return result[0];
  }

  async createUser(user: any): Promise<any> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async createClient(client: any): Promise<any> {
    const result = await db.insert(clients).values(client).returning();
    return result[0];
  }

  async createProduct(product: any): Promise<any> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async createOrder(order: any): Promise<any> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async addHotelMerchant(association: any): Promise<any> {
    const result = await db.insert(hotelMerchants).values(association).returning();
    return result[0];
  }

  async getHotel(id: number): Promise<any> {
    const result = await db.select().from(hotels).where(eq(hotels.id, id));
    return result[0];
  }

  async getMerchant(id: number): Promise<any> {
    const result = await db.select().from(merchants).where(eq(merchants.id, id));
    return result[0];
  }

  async getProduct(id: number): Promise<any> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getOrder(id: number): Promise<any> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async getAllHotels(): Promise<any[]> {
    return await db.select().from(hotels);
  }

  async getAllMerchants(): Promise<any[]> {
    return await db.select().from(merchants);
  }

  async getAllProducts(): Promise<any[]> {
    return await db.select().from(products);
  }

  async getAllOrders(): Promise<any[]> {
    return await db.select().from(orders);
  }

  async getAllClients(): Promise<any[]> {
    return await db.select().from(clients);
  }

  async getAllUsers(): Promise<any[]> {
    return await db.select().from(users);
  }

  async getHotelMerchants(hotelId: number): Promise<any[]> {
    return await db.select().from(hotelMerchants).where(eq(hotelMerchants.hotelId, hotelId));
  }

  async getMerchantHotels(merchantId: number): Promise<any[]> {
    return await db.select().from(hotelMerchants).where(eq(hotelMerchants.merchantId, merchantId));
  }
}

import { eq } from 'drizzle-orm';

async function testLocalDatabase() {
  console.log("🧪 Test de la base de données locale...");

  try {
    // Test de connexion
    console.log("\n1. Test de connexion...");
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log("✅ Connexion réussie");

    // Créer les tables
    console.log("\n2. Création des tables...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS hotels (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        latitude TEXT NOT NULL,
        longitude TEXT NOT NULL,
        qr_code TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS merchants (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        category TEXT NOT NULL,
        latitude TEXT NOT NULL,
        longitude TEXT NOT NULL,
        rating TEXT DEFAULT '0.0' NOT NULL,
        review_count INTEGER DEFAULT 0 NOT NULL,
        is_open BOOLEAN DEFAULT TRUE NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        entity_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        has_completed_tutorial BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        merchant_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price TEXT NOT NULL,
        image_url TEXT,
        is_available BOOLEAN DEFAULT TRUE NOT NULL,
        category TEXT NOT NULL,
        is_souvenir BOOLEAN DEFAULT FALSE NOT NULL,
        origin TEXT,
        material TEXT,
        stock INTEGER DEFAULT 100,
        validation_status TEXT DEFAULT 'pending' NOT NULL,
        rejection_reason TEXT,
        validated_at TIMESTAMP,
        validated_by INTEGER,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        hotel_id INTEGER NOT NULL,
        merchant_id INTEGER NOT NULL,
        client_id INTEGER,
        order_number TEXT NOT NULL UNIQUE,
        customer_name TEXT NOT NULL,
        customer_room TEXT NOT NULL,
        items JSONB NOT NULL,
        total_amount TEXT NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL,
        merchant_commission TEXT,
        zishop_commission TEXT,
        hotel_commission TEXT,
        delivery_notes TEXT,
        confirmed_at TIMESTAMP,
        delivered_at TIMESTAMP,
        estimated_delivery TIMESTAMP,
        picked_up BOOLEAN DEFAULT FALSE,
        picked_up_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS hotel_merchants (
        id SERIAL PRIMARY KEY,
        hotel_id INTEGER NOT NULL,
        merchant_id INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    console.log("✅ Tables créées");

    // Créer les contraintes
    console.log("\n3. Création des contraintes...");
    
    await db.execute(sql`
      ALTER TABLE hotel_merchants 
      ADD CONSTRAINT hotel_merchants_hotel_id_fkey 
      FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
    `);

    await db.execute(sql`
      ALTER TABLE hotel_merchants 
      ADD CONSTRAINT hotel_merchants_merchant_id_fkey 
      FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
    `);

    await db.execute(sql`
      ALTER TABLE orders 
      ADD CONSTRAINT orders_client_id_fkey 
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
    `);

    await db.execute(sql`
      ALTER TABLE orders 
      ADD CONSTRAINT orders_merchant_id_fkey 
      FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
    `);

    await db.execute(sql`
      ALTER TABLE orders 
      ADD CONSTRAINT orders_hotel_id_fkey 
      FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
    `);

    await db.execute(sql`
      ALTER TABLE products 
      ADD CONSTRAINT products_merchant_id_fkey 
      FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
    `);

    await db.execute(sql`
      ALTER TABLE products 
      ADD CONSTRAINT products_validated_by_fkey 
      FOREIGN KEY (validated_by) REFERENCES users(id) ON DELETE SET NULL
    `);

    console.log("✅ Contraintes créées");

    // Test des opérations CRUD
    console.log("\n4. Test des opérations CRUD...");
    
    const storage = new TestStorage();

    // Créer un hôtel
    const hotelData = {
      name: "Hôtel Test Local",
      address: "123 Rue Test Local",
      code: "TESTLOCAL001",
      latitude: "48.8566",
      longitude: "2.3522",
      qrCode: "qr_test_local_001"
    };
    const validatedHotel = insertHotelSchema.parse(hotelData);
    const hotel = await storage.createHotel(validatedHotel);
    console.log("✅ Hôtel créé:", hotel.id);

    // Créer un commerçant
    const merchantData = {
      name: "Commerçant Test Local",
      address: "456 Avenue Test Local",
      category: "restaurant",
      latitude: "48.8566",
      longitude: "2.3522"
    };
    const validatedMerchant = insertMerchantSchema.parse(merchantData);
    const merchant = await storage.createMerchant(validatedMerchant);
    console.log("✅ Commerçant créé:", merchant.id);

    // Créer un utilisateur
    const userData = {
      username: "admin_test_local",
      password: "password123",
      role: "admin"
    };
    const validatedUser = insertUserSchema.parse(userData);
    const user = await storage.createUser(validatedUser);
    console.log("✅ Utilisateur créé:", user.id);

    // Créer un client
    const clientData = {
      email: "client@testlocal.com",
      password: "password123",
      firstName: "Jean",
      lastName: "Test Local",
      phone: "0123456789"
    };
    const validatedClient = insertClientSchema.parse(clientData);
    const client = await storage.createClient(validatedClient);
    console.log("✅ Client créé:", client.id);

    // Créer un produit
    const productData = {
      merchantId: merchant.id,
      name: "Produit Test Local",
      description: "Description du produit test local",
      price: "10.50",
      category: "nourriture",
      isSouvenir: false
    };
    const validatedProduct = insertProductSchema.parse(productData);
    const product = await storage.createProduct(validatedProduct);
    console.log("✅ Produit créé:", product.id);

    // Créer une commande
    const orderData = {
      hotelId: hotel.id,
      merchantId: merchant.id,
      clientId: client.id,
      customerName: "Client Test Local",
      customerRoom: "101",
      items: JSON.stringify([{
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 2
      }]),
      totalAmount: "21.00"
    };
    const order = await storage.createOrder(orderData);
    console.log("✅ Commande créée:", order.id);

    // Créer une association hotel-merchant
    const hotelMerchantData = {
      hotelId: hotel.id,
      merchantId: merchant.id
    };
    const hotelMerchant = await storage.addHotelMerchant(hotelMerchantData);
    console.log("✅ Association hotel-merchant créée:", hotelMerchant.id);

    // Vérifier les données
    console.log("\n5. Vérification des données...");
    const hotels = await storage.getAllHotels();
    const merchants = await storage.getAllMerchants();
    const products = await storage.getAllProducts();
    const orders = await storage.getAllOrders();
    const clients = await storage.getAllClients();
    const users = await storage.getAllUsers();

    console.log(`📊 Données créées:`);
    console.log(`   - Hôtels: ${hotels.length}`);
    console.log(`   - Commerçants: ${merchants.length}`);
    console.log(`   - Produits: ${products.length}`);
    console.log(`   - Commandes: ${orders.length}`);
    console.log(`   - Clients: ${clients.length}`);
    console.log(`   - Utilisateurs: ${users.length}`);

    // Vérifier les contraintes
    console.log("\n6. Vérification des contraintes...");
    const constraints = await db.execute(sql`
      SELECT 
        tc.constraint_name,
        tc.table_name as source_table,
        kcu.column_name as source_column,
        ccu.table_name as target_table,
        ccu.column_name as target_column
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name
    `);

    console.log("\n📋 Contraintes vérifiées:");
    constraints.forEach((constraint: any) => {
      console.log(`  - ${constraint.constraint_name}: ${constraint.source_table}.${constraint.source_column} -> ${constraint.target_table}.${constraint.target_column}`);
    });

    console.log("\n🎉 Tous les tests ont réussi !");

  } catch (error) {
    console.error("❌ Erreur lors des tests:", error);
    throw error;
  }
}

import { sql } from "drizzle-orm";

// Exécuter les tests si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  testLocalDatabase()
    .then(() => {
      console.log("✅ Tests locaux terminés avec succès !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Tests locaux échoués:", error);
      process.exit(1);
    });
}

export { testLocalDatabase };