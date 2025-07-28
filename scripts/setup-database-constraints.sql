-- Script SQL pour configurer la base de données ZiShop avec toutes les contraintes
-- ==============================================================================

-- 1. Création des tables (si elles n'existent pas)
-- ================================================

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
);

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
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  entity_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

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
);

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
);

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
);

CREATE TABLE IF NOT EXISTS hotel_merchants (
  id SERIAL PRIMARY KEY,
  hotel_id INTEGER NOT NULL,
  merchant_id INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 2. Suppression des contraintes existantes (si elles existent)
-- =============================================================

ALTER TABLE hotel_merchants DROP CONSTRAINT IF EXISTS hotel_merchants_hotel_id_fkey;
ALTER TABLE hotel_merchants DROP CONSTRAINT IF EXISTS hotel_merchants_merchant_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_client_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_merchant_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_hotel_id_fkey;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_merchant_id_fkey;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_validated_by_fkey;

-- 3. Création des contraintes de clés étrangères
-- ===============================================

-- Contraintes pour hotel_merchants
ALTER TABLE hotel_merchants 
ADD CONSTRAINT hotel_merchants_hotel_id_fkey 
FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE;

ALTER TABLE hotel_merchants 
ADD CONSTRAINT hotel_merchants_merchant_id_fkey 
FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE;

-- Contraintes pour orders
ALTER TABLE orders 
ADD CONSTRAINT orders_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;

ALTER TABLE orders 
ADD CONSTRAINT orders_merchant_id_fkey 
FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE;

ALTER TABLE orders 
ADD CONSTRAINT orders_hotel_id_fkey 
FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE;

-- Contraintes pour products
ALTER TABLE products 
ADD CONSTRAINT products_merchant_id_fkey 
FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE;

ALTER TABLE products 
ADD CONSTRAINT products_validated_by_fkey 
FOREIGN KEY (validated_by) REFERENCES users(id) ON DELETE SET NULL;

-- 4. Création des index pour améliorer les performances
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_hotels_code ON hotels(code);
CREATE INDEX IF NOT EXISTS idx_merchants_category ON merchants(category);
CREATE INDEX IF NOT EXISTS idx_products_merchant_id ON products(merchant_id);
CREATE INDEX IF NOT EXISTS idx_orders_hotel_id ON orders(hotel_id);
CREATE INDEX IF NOT EXISTS idx_orders_merchant_id ON orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_hotel_merchants_hotel_id ON hotel_merchants(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_merchants_merchant_id ON hotel_merchants(merchant_id);

-- 5. Vérification des contraintes créées
-- ======================================

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
ORDER BY tc.table_name, kcu.column_name;

-- 6. Message de confirmation
-- ==========================

SELECT 'ZiShop Database Constraints Setup Complete!' as status;