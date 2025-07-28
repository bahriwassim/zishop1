import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  code: text("code").notNull().unique(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  qrCode: text("qr_code").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const merchants = pgTable("merchants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  category: text("category").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  rating: text("rating").default("0.0").notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  isOpen: boolean("is_open").default(true).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").references(() => merchants.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true).notNull(),
  category: text("category").notNull(),
  isSouvenir: boolean("is_souvenir").default(false).notNull(),
  origin: text("origin"),
  material: text("material"),
  stock: integer("stock").default(100),
  validationStatus: text("validation_status").default("pending").notNull(),
  rejectionReason: text("rejection_reason"),
  validatedAt: timestamp("validated_at"),
  validatedBy: integer("validated_by").references(() => users.id, { onDelete: "set null" }),
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
  hotelId: integer("hotel_id").references(() => hotels.id, { onDelete: "cascade" }).notNull(),
  merchantId: integer("merchant_id").references(() => merchants.id, { onDelete: "cascade" }).notNull(),
  clientId: integer("client_id").references(() => clients.id, { onDelete: "set null" }),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerRoom: text("customer_room").notNull(),
  items: jsonb("items").notNull(),
  totalAmount: text("total_amount").notNull(),
  status: text("status").default("pending").notNull(),
  merchantCommission: text("merchant_commission"),
  zishopCommission: text("zishop_commission"),
  hotelCommission: text("hotel_commission"),
  deliveryNotes: text("delivery_notes"),
  confirmedAt: timestamp("confirmed_at"),
  deliveredAt: timestamp("delivered_at"),
  estimatedDelivery: timestamp("estimated_delivery"),
  pickedUp: boolean("picked_up").default(false),
  pickedUpAt: timestamp("picked_up_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  entityId: integer("entity_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const hotelMerchants = pgTable("hotel_merchants", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").references(() => hotels.id, { onDelete: "cascade" }).notNull(),
  merchantId: integer("merchant_id").references(() => merchants.id, { onDelete: "cascade" }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHotelSchema = createInsertSchema(hotels).omit({
  id: true,
}).transform((data) => ({
  ...data,
  latitude: data.latitude?.toString() || "0",
  longitude: data.longitude?.toString() || "0"
}));

export const insertMerchantSchema = createInsertSchema(merchants).omit({
  id: true,
}).transform((data) => ({
  ...data,
  latitude: data.latitude?.toString() || "0",
  longitude: data.longitude?.toString() || "0"
}));

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
