import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  code: text("code").notNull().unique(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  qrCode: text("qr_code").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const merchants = pgTable("merchants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  category: text("category").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0").notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  isOpen: boolean("is_open").default(true).notNull(),
  imageUrl: text("image_url"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").references(() => merchants.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true).notNull(),
  category: text("category").notNull(),
  isSouvenir: boolean("is_souvenir").default(false).notNull(),
  origin: text("origin"), // Pays/région d'origine du souvenir
  material: text("material"), // Matériau (bois, métal, textile, etc.)
  stock: integer("stock").default(100), // Ajout du stock
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  hasCompletedTutorial: boolean("has_completed_tutorial").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").references(() => hotels.id).notNull(),
  merchantId: integer("merchant_id").references(() => merchants.id).notNull(),
  clientId: integer("client_id").references(() => clients.id),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerRoom: text("customer_room").notNull(),
  items: jsonb("items").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending").notNull(), // pending, confirmed, preparing, ready, delivering, delivered, cancelled
  merchantCommission: decimal("merchant_commission", { precision: 10, scale: 2 }), // 75%
  zishopCommission: decimal("zishop_commission", { precision: 10, scale: 2 }), // 20%
  hotelCommission: decimal("hotel_commission", { precision: 10, scale: 2 }), // 5%
  deliveryNotes: text("delivery_notes"), // Notes pour la livraison
  confirmedAt: timestamp("confirmed_at"), // Timestamp de confirmation par le marchand
  deliveredAt: timestamp("delivered_at"), // Timestamp de livraison
  estimatedDelivery: timestamp("estimated_delivery"), // Estimation de livraison
  pickedUp: boolean("picked_up").default(false), // Si le client a récupéré la commande à la réception
  pickedUpAt: timestamp("picked_up_at"), // Timestamp de remise au client
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'admin', 'hotel', 'merchant'
  entityId: integer("entity_id"), // references hotels.id or merchants.id
});

export const hotelMerchants = pgTable("hotel_merchants", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").references(() => hotels.id).notNull(),
  merchantId: integer("merchant_id").references(() => merchants.id).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHotelSchema = createInsertSchema(hotels).omit({
  id: true,
});

export const insertMerchantSchema = createInsertSchema(merchants).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  isActive: true,
  hasCompletedTutorial: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertHotelMerchantSchema = createInsertSchema(hotelMerchants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;

export type Merchant = typeof merchants.$inferSelect;
export type InsertMerchant = z.infer<typeof insertMerchantSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type HotelMerchant = typeof hotelMerchants.$inferSelect;
export type InsertHotelMerchant = z.infer<typeof insertHotelMerchantSchema>;
