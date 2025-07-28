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
  qr_code: text("qr_code").notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const merchants = pgTable("merchants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  category: text("category").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  rating: text("rating").default("0.0").notNull(),
  review_count: integer("review_count").default(0).notNull(),
  is_open: boolean("is_open").default(true).notNull(),
  image_url: text("image_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  merchant_id: integer("merchant_id").references(() => merchants.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  image_url: text("image_url"),
  is_available: boolean("is_available").default(true).notNull(),
  category: text("category").notNull(),
  is_souvenir: boolean("is_souvenir").default(false).notNull(),
  origin: text("origin"),
  material: text("material"),
  stock: integer("stock").default(100),
  validation_status: text("validation_status").default("pending").notNull(),
  rejection_reason: text("rejection_reason"),
  validated_at: timestamp("validated_at"),
  validated_by: integer("validated_by").references(() => users.id, { onDelete: "set null" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  phone: text("phone").notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  has_completed_tutorial: boolean("has_completed_tutorial").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  hotel_id: integer("hotel_id").references(() => hotels.id, { onDelete: "cascade" }).notNull(),
  merchant_id: integer("merchant_id").references(() => merchants.id, { onDelete: "cascade" }).notNull(),
  client_id: integer("client_id").references(() => clients.id, { onDelete: "set null" }),
  order_number: text("order_number").notNull().unique(),
  customer_name: text("customer_name").notNull(),
  customer_room: text("customer_room").notNull(),
  items: jsonb("items").notNull(),
  total_amount: text("total_amount").notNull(),
  status: text("status").default("pending").notNull(),
  merchant_commission: text("merchant_commission"),
  zishop_commission: text("zishop_commission"),
  hotel_commission: text("hotel_commission"),
  delivery_notes: text("delivery_notes"),
  confirmed_at: timestamp("confirmed_at"),
  delivered_at: timestamp("delivered_at"),
  estimated_delivery: timestamp("estimated_delivery"),
  picked_up: boolean("picked_up").default(false),
  picked_up_at: timestamp("picked_up_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  entity_id: integer("entity_id"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const hotel_merchants = pgTable("hotel_merchants", {
  id: serial("id").primaryKey(),
  hotel_id: integer("hotel_id").references(() => hotels.id, { onDelete: "cascade" }).notNull(),
  merchant_id: integer("merchant_id").references(() => merchants.id, { onDelete: "cascade" }).notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
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
  is_active: true,
  has_completed_tutorial: true,
  created_at: true,
  updated_at: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  order_number: true,
  created_at: true,
  updated_at: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertHotelMerchantSchema = createInsertSchema(hotel_merchants).omit({
  id: true,
  created_at: true,
  updated_at: true,
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

export type HotelMerchant = typeof hotel_merchants.$inferSelect;
export type InsertHotelMerchant = z.infer<typeof insertHotelMerchantSchema>;
