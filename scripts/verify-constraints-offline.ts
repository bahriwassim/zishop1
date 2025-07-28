import { hotels, merchants, products, orders, clients, users, hotel_merchants } from "../shared/schema";

const expectedConstraints = [
  {
    "constraint_name": "hotel_merchants_hotel_id_fkey",
    "table_schema": "public",
    "source_table": "hotel_merchants",
    "source_column": "hotel_id",
    "target_table": "hotels",
    "target_column": "id"
  },
  {
    "constraint_name": "hotel_merchants_merchant_id_fkey",
    "table_schema": "public",
    "source_table": "hotel_merchants",
    "source_column": "merchant_id",
    "target_table": "merchants",
    "target_column": "id"
  },
  {
    "constraint_name": "orders_client_id_fkey",
    "table_schema": "public",
    "source_table": "orders",
    "source_column": "client_id",
    "target_table": "clients",
    "target_column": "id"
  },
  {
    "constraint_name": "orders_merchant_id_fkey",
    "table_schema": "public",
    "source_table": "orders",
    "source_column": "merchant_id",
    "target_table": "merchants",
    "target_column": "id"
  },
  {
    "constraint_name": "orders_hotel_id_fkey",
    "table_schema": "public",
    "source_table": "orders",
    "source_column": "hotel_id",
    "target_table": "hotels",
    "target_column": "id"
  },
  {
    "constraint_name": "products_merchant_id_fkey",
    "table_schema": "public",
    "source_table": "products",
    "source_column": "merchant_id",
    "target_table": "merchants",
    "target_column": "id"
  },
  {
    "constraint_name": "products_validated_by_fkey",
    "table_schema": "public",
    "source_table": "products",
    "source_column": "validated_by",
    "target_table": "users",
    "target_column": "id"
  }
];

function verifySchemaConstraints() {
  console.log("🔍 Vérification des contraintes du schéma...");

  let allConstraintsValid = true;

  // Vérifier les contraintes dans le schéma Drizzle
  console.log("\n1. Vérification des contraintes dans le schéma Drizzle...");

  // Vérifier hotel_merchants.hotel_id -> hotels.id
  const hotelMerchantsHotelIdRef = hotel_merchants.hotel_id.references;
  if (hotelMerchantsHotelIdRef && hotelMerchantsHotelIdRef() === hotels.id) {
    console.log("✅ hotel_merchants.hotel_id -> hotels.id");
  } else {
    console.log("❌ hotel_merchants.hotel_id -> hotels.id (manquant ou incorrect)");
    allConstraintsValid = false;
  }

  // Vérifier hotel_merchants.merchant_id -> merchants.id
  const hotelMerchantsMerchantIdRef = hotel_merchants.merchant_id.references;
  if (hotelMerchantsMerchantIdRef && hotelMerchantsMerchantIdRef() === merchants.id) {
    console.log("✅ hotel_merchants.merchant_id -> merchants.id");
  } else {
    console.log("❌ hotel_merchants.merchant_id -> merchants.id (manquant ou incorrect)");
    allConstraintsValid = false;
  }

  // Vérifier orders.client_id -> clients.id
  const ordersClientIdRef = orders.client_id.references;
  if (ordersClientIdRef && ordersClientIdRef() === clients.id) {
    console.log("✅ orders.client_id -> clients.id");
  } else {
    console.log("❌ orders.client_id -> clients.id (manquant ou incorrect)");
    allConstraintsValid = false;
  }

  // Vérifier orders.merchant_id -> merchants.id
  const ordersMerchantIdRef = orders.merchant_id.references;
  if (ordersMerchantIdRef && ordersMerchantIdRef() === merchants.id) {
    console.log("✅ orders.merchant_id -> merchants.id");
  } else {
    console.log("❌ orders.merchant_id -> merchants.id (manquant ou incorrect)");
    allConstraintsValid = false;
  }

  // Vérifier orders.hotel_id -> hotels.id
  const ordersHotelIdRef = orders.hotel_id.references;
  if (ordersHotelIdRef && ordersHotelIdRef() === hotels.id) {
    console.log("✅ orders.hotel_id -> hotels.id");
  } else {
    console.log("❌ orders.hotel_id -> hotels.id (manquant ou incorrect)");
    allConstraintsValid = false;
  }

  // Vérifier products.merchant_id -> merchants.id
  const productsMerchantIdRef = products.merchant_id.references;
  if (productsMerchantIdRef && productsMerchantIdRef() === merchants.id) {
    console.log("✅ products.merchant_id -> merchants.id");
  } else {
    console.log("❌ products.merchant_id -> merchants.id (manquant ou incorrect)");
    allConstraintsValid = false;
  }

  // Vérifier products.validated_by -> users.id
  const productsValidatedByRef = products.validated_by.references;
  if (productsValidatedByRef && productsValidatedByRef() === users.id) {
    console.log("✅ products.validated_by -> users.id");
  } else {
    console.log("❌ products.validated_by -> users.id (manquant ou incorrect)");
    allConstraintsValid = false;
  }

  // Vérifier la structure des tables
  console.log("\n2. Vérification de la structure des tables...");

  const expectedTables = [
    { name: 'hotels', columns: ['id', 'name', 'address', 'code', 'latitude', 'longitude', 'qr_code', 'is_active', 'created_at', 'updated_at'] },
    { name: 'merchants', columns: ['id', 'name', 'address', 'category', 'latitude', 'longitude', 'rating', 'review_count', 'is_open', 'image_url', 'created_at', 'updated_at'] },
    { name: 'users', columns: ['id', 'username', 'password', 'role', 'entity_id', 'created_at', 'updated_at'] },
    { name: 'clients', columns: ['id', 'email', 'password', 'first_name', 'last_name', 'phone', 'is_active', 'has_completed_tutorial', 'created_at', 'updated_at'] },
    { name: 'products', columns: ['id', 'merchant_id', 'name', 'description', 'price', 'image_url', 'is_available', 'category', 'is_souvenir', 'origin', 'material', 'stock', 'validation_status', 'rejection_reason', 'validated_at', 'validated_by', 'created_at', 'updated_at'] },
    { name: 'orders', columns: ['id', 'hotel_id', 'merchant_id', 'client_id', 'order_number', 'customer_name', 'customer_room', 'items', 'total_amount', 'status', 'merchant_commission', 'zishop_commission', 'hotel_commission', 'delivery_notes', 'confirmed_at', 'delivered_at', 'estimated_delivery', 'picked_up', 'picked_up_at', 'created_at', 'updated_at'] },
    { name: 'hotel_merchants', columns: ['id', 'hotel_id', 'merchant_id', 'is_active', 'created_at', 'updated_at'] }
  ];

  for (const expectedTable of expectedTables) {
    console.log(`\n  Table: ${expectedTable.name}`);
    const tableSchema = getTableSchema(expectedTable.name);
    if (tableSchema) {
      const actualColumns = Object.keys(tableSchema);
      const missingColumns = expectedTable.columns.filter(col => !actualColumns.includes(col));
      const extraColumns = actualColumns.filter(col => !expectedTable.columns.includes(col));
      
      if (missingColumns.length === 0 && extraColumns.length === 0) {
        console.log("    ✅ Structure correcte");
      } else {
        console.log("    ❌ Structure incorrecte");
        if (missingColumns.length > 0) {
          console.log(`      - Colonnes manquantes: ${missingColumns.join(', ')}`);
        }
        if (extraColumns.length > 0) {
          console.log(`      - Colonnes supplémentaires: ${extraColumns.join(', ')}`);
        }
        allConstraintsValid = false;
      }
    } else {
      console.log("    ❌ Table non trouvée");
      allConstraintsValid = false;
    }
  }

  // Générer le script SQL pour créer les contraintes
  console.log("\n3. Génération du script SQL pour les contraintes...");
  
  const sqlScript = generateConstraintsSQL();
  console.log("\n📝 Script SQL généré:");
  console.log(sqlScript);

  // Résumé
  console.log("\n📋 Résumé de la vérification:");
  if (allConstraintsValid) {
    console.log("✅ Toutes les contraintes sont correctement définies dans le schéma");
  } else {
    console.log("❌ Certaines contraintes sont manquantes ou incorrectes");
  }

  return allConstraintsValid;
}

function getTableSchema(tableName: string): any {
  const schemas = {
    hotels: hotels,
    merchants: merchants,
    users: users,
    clients: clients,
    products: products,
    orders: orders,
    hotel_merchants: hotel_merchants
  };
  
  return schemas[tableName as keyof typeof schemas];
}

function generateConstraintsSQL(): string {
  return `-- Script SQL pour créer les contraintes de clés étrangères
-- ZiShop E-commerce Hotel System

-- Supprimer les contraintes existantes si elles existent
ALTER TABLE hotel_merchants DROP CONSTRAINT IF EXISTS hotel_merchants_hotel_id_fkey;
ALTER TABLE hotel_merchants DROP CONSTRAINT IF EXISTS hotel_merchants_merchant_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_client_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_merchant_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_hotel_id_fkey;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_merchant_id_fkey;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_validated_by_fkey;

-- Créer les nouvelles contraintes
ALTER TABLE hotel_merchants 
ADD CONSTRAINT hotel_merchants_hotel_id_fkey 
FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE;

ALTER TABLE hotel_merchants 
ADD CONSTRAINT hotel_merchants_merchant_id_fkey 
FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE;

ALTER TABLE orders 
ADD CONSTRAINT orders_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;

ALTER TABLE orders 
ADD CONSTRAINT orders_merchant_id_fkey 
FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE;

ALTER TABLE orders 
ADD CONSTRAINT orders_hotel_id_fkey 
FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE;

ALTER TABLE products 
ADD CONSTRAINT products_merchant_id_fkey 
FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE;

ALTER TABLE products 
ADD CONSTRAINT products_validated_by_fkey 
FOREIGN KEY (validated_by) REFERENCES users(id) ON DELETE SET NULL;

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_hotels_code ON hotels(code);
CREATE INDEX IF NOT EXISTS idx_merchants_category ON merchants(category);
CREATE INDEX IF NOT EXISTS idx_products_merchant_id ON products(merchant_id);
CREATE INDEX IF NOT EXISTS idx_orders_hotel_id ON orders(hotel_id);
CREATE INDEX IF NOT EXISTS idx_orders_merchant_id ON orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_hotel_merchants_hotel_id ON hotel_merchants(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_merchants_merchant_id ON hotel_merchants(merchant_id);

-- Vérification des contraintes créées
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
ORDER BY tc.table_name, kcu.column_name;`;
}

// Exécuter la vérification si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const isValid = verifySchemaConstraints();
  
  if (isValid) {
    console.log("\n🎉 Vérification terminée avec succès !");
    process.exit(0);
  } else {
    console.log("\n⚠️ Vérification terminée avec des problèmes détectés");
    process.exit(1);
  }
}

export { verifySchemaConstraints, generateConstraintsSQL };