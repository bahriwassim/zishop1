import { supabase, STORAGE_BUCKETS } from '../shared/supabase.js'

async function setupSupabase() {
  console.log('🚀 Configuration de Supabase...')

  try {
    // 1. Créer les tables via SQL
    console.log('📊 Création des tables...')
    
    const createTablesSQL = `
      -- Table des hôtels
      CREATE TABLE IF NOT EXISTS hotels (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        latitude DECIMAL(10,8) NOT NULL,
        longitude DECIMAL(11,8) NOT NULL,
        qr_code TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Table des marchands
      CREATE TABLE IF NOT EXISTS merchants (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        category TEXT NOT NULL,
        latitude DECIMAL(10,8) NOT NULL,
        longitude DECIMAL(11,8) NOT NULL,
        rating DECIMAL(2,1) DEFAULT 0.0 NOT NULL,
        review_count INTEGER DEFAULT 0 NOT NULL,
        is_open BOOLEAN DEFAULT true NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Table des produits
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        merchant_id INTEGER REFERENCES merchants(id) NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        is_available BOOLEAN DEFAULT true NOT NULL,
        category TEXT NOT NULL,
        is_souvenir BOOLEAN DEFAULT false NOT NULL,
        origin TEXT,
        material TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Table des commandes
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        hotel_id INTEGER REFERENCES hotels(id) NOT NULL,
        merchant_id INTEGER REFERENCES merchants(id) NOT NULL,
        order_number TEXT NOT NULL UNIQUE,
        customer_name TEXT NOT NULL,
        customer_room TEXT NOT NULL,
        items JSONB NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      -- Table des utilisateurs
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        entity_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Index pour optimiser les performances
      CREATE INDEX IF NOT EXISTS idx_products_merchant_id ON products(merchant_id);
      CREATE INDEX IF NOT EXISTS idx_orders_hotel_id ON orders(hotel_id);
      CREATE INDEX IF NOT EXISTS idx_orders_merchant_id ON orders(merchant_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

      -- Trigger pour updated_at
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON merchants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `

    const { error: sqlError } = await supabase.rpc('exec_sql', { sql: createTablesSQL })
    
    if (sqlError) {
      console.error('❌ Erreur lors de la création des tables:', sqlError)
      // Essayons avec une approche différente si la fonction RPC n'existe pas
      console.log('⚠️  Tentative alternative...')
      console.log('Veuillez exécuter ce SQL directement dans l\'éditeur SQL de Supabase:')
      console.log(createTablesSQL)
    } else {
      console.log('✅ Tables créées avec succès')
    }

    // 2. Créer les buckets de storage
    console.log('🗂️  Création des buckets de storage...')
    
    for (const bucketName of Object.values(STORAGE_BUCKETS)) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB
      })
      
      if (error && error.message !== 'Bucket already exists') {
        console.error(`❌ Erreur création bucket ${bucketName}:`, error)
      } else {
        console.log(`✅ Bucket '${bucketName}' créé/vérifié`)
      }
    }

    // 3. Configurer les politiques RLS (Row Level Security)
    console.log('🔒 Configuration des politiques de sécurité...')
    
    const rlsPolicies = `
      -- Activer RLS sur toutes les tables
      ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
      ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
      ALTER TABLE products ENABLE ROW LEVEL SECURITY;
      ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;

      -- Politiques pour les tables publiques (lecture)
      CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON hotels FOR SELECT USING (true);
      CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON merchants FOR SELECT USING (true);
      CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON products FOR SELECT USING (true);
      
      -- Politiques pour les commandes (basées sur l'utilisateur)
      CREATE POLICY IF NOT EXISTS "Enable read access for authenticated users" ON orders FOR SELECT USING (auth.role() = 'authenticated');
      CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users" ON orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      
      -- Politiques pour les utilisateurs (restreintes)
      CREATE POLICY IF NOT EXISTS "Enable read access for authenticated users only" ON users FOR SELECT USING (auth.role() = 'authenticated');
    `

    console.log('Politiques RLS à exécuter manuellement dans l\'éditeur SQL de Supabase:')
    console.log(rlsPolicies)

    console.log('🎉 Configuration Supabase terminée avec succès!')
    console.log('📝 N\'oubliez pas d\'exécuter les scripts SQL dans l\'éditeur SQL de Supabase')
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error)
    process.exit(1)
  }
}

// Exécuter le script
setupSupabase().catch(console.error) 