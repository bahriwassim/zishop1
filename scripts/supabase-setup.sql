-- Script de configuration complète pour Supabase ZiShop
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- ==================================================
-- 1. SUPPRESSION DES TABLES EXISTANTES (SI BESOIN)
-- ==================================================

DROP TABLE IF EXISTS hotel_merchants CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS merchants CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;

-- ==================================================
-- 2. CRÉATION DES TABLES
-- ==================================================

-- Table des hôtels
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    qr_code TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Table des commerçants
CREATE TABLE merchants (
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
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Table des utilisateurs (admin, hotel, merchant)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'hotel', 'merchant')),
    entity_id INTEGER, -- références hotels.id ou merchants.id selon le rôle
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Table des clients
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    has_completed_tutorial BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Table des produits
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    merchant_id INTEGER REFERENCES merchants(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true NOT NULL,
    category TEXT NOT NULL,
    is_souvenir BOOLEAN DEFAULT false NOT NULL,
    origin TEXT, -- Pays/région d'origine du souvenir
    material TEXT, -- Matériau (bois, métal, textile, etc.)
    stock INTEGER DEFAULT 100, -- Stock disponible
    validation_status TEXT DEFAULT 'pending' NOT NULL CHECK (validation_status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT, -- Raison du rejet par l'admin
    validated_at TIMESTAMP, -- Date de validation
    validated_by INTEGER REFERENCES users(id), -- ID de l'admin qui a validé
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Table des commandes
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER REFERENCES hotels(id) NOT NULL,
    merchant_id INTEGER REFERENCES merchants(id) NOT NULL,
    client_id INTEGER REFERENCES clients(id),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_room TEXT NOT NULL,
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled')),
    merchant_commission DECIMAL(10,2), -- 75%
    zishop_commission DECIMAL(10,2), -- 20%
    hotel_commission DECIMAL(10,2), -- 5%
    delivery_notes TEXT, -- Notes pour la livraison
    confirmed_at TIMESTAMP, -- Timestamp de confirmation par le marchand
    delivered_at TIMESTAMP, -- Timestamp de livraison
    estimated_delivery TIMESTAMP, -- Estimation de livraison
    picked_up BOOLEAN DEFAULT false, -- Si le client a récupéré la commande à la réception
    picked_up_at TIMESTAMP, -- Timestamp de remise au client
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Table des associations hôtel-commerçant
CREATE TABLE hotel_merchants (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER REFERENCES hotels(id) NOT NULL,
    merchant_id INTEGER REFERENCES merchants(id) NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    UNIQUE(hotel_id, merchant_id)
);

-- ==================================================
-- 3. CRÉATION DES INDEX POUR LES PERFORMANCES
-- ==================================================

-- Index pour les recherches fréquentes
CREATE INDEX idx_products_merchant_id ON products(merchant_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_validation_status ON products(validation_status);
CREATE INDEX idx_orders_hotel_id ON orders(hotel_id);
CREATE INDEX idx_orders_merchant_id ON orders(merchant_id);
CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_entity_id ON users(entity_id);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_hotels_code ON hotels(code);
CREATE INDEX idx_hotels_active ON hotels(is_active);
CREATE INDEX idx_merchants_category ON merchants(category);
CREATE INDEX idx_merchants_open ON merchants(is_open);

-- Index pour la recherche par coordonnées
CREATE INDEX idx_hotels_latitude ON hotels(latitude);
CREATE INDEX idx_hotels_longitude ON hotels(longitude);
CREATE INDEX idx_merchants_latitude ON merchants(latitude);
CREATE INDEX idx_merchants_longitude ON merchants(longitude);

-- ==================================================
-- 4. FONCTIONS ET TRIGGERS
-- ==================================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at sur toutes les tables
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON merchants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotel_merchants_updated_at BEFORE UPDATE ON hotel_merchants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour calculer automatiquement les commissions
CREATE OR REPLACE FUNCTION calculate_commissions()
RETURNS TRIGGER AS $$
BEGIN
    NEW.merchant_commission = NEW.total_amount * 0.75;
    NEW.zishop_commission = NEW.total_amount * 0.20;
    NEW.hotel_commission = NEW.total_amount * 0.05;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour calculer les commissions automatiquement
CREATE TRIGGER calculate_order_commissions 
    BEFORE INSERT OR UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_commissions();

-- Fonction pour gérer le stock automatiquement
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
DECLARE
    item JSONB;
    product_id INTEGER;
    quantity INTEGER;
BEGIN
    -- Si c'est une nouvelle commande confirmée
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status != 'confirmed' AND NEW.status = 'confirmed') THEN
        -- Décrémenter le stock pour chaque item
        FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
        LOOP
            product_id := (item->>'productId')::INTEGER;
            quantity := (item->>'quantity')::INTEGER;
            
            UPDATE products 
            SET stock = GREATEST(0, stock - quantity)
            WHERE id = product_id;
        END LOOP;
    END IF;
    
    -- Si une commande est annulée, restaurer le stock
    IF TG_OP = 'UPDATE' AND OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
        FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
        LOOP
            product_id := (item->>'productId')::INTEGER;
            quantity := (item->>'quantity')::INTEGER;
            
            UPDATE products 
            SET stock = stock + quantity
            WHERE id = product_id;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour la gestion automatique du stock
CREATE TRIGGER manage_product_stock 
    AFTER INSERT OR UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_product_stock();

-- ==================================================
-- 5. INSERTION DES DONNÉES DE BASE
-- ==================================================

-- Insertion d'un utilisateur admin par défaut
INSERT INTO users (username, password, role) VALUES 
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'); -- mot de passe: password

-- Insertion d'hôtels de test
INSERT INTO hotels (name, address, code, latitude, longitude, qr_code) VALUES 
('Hôtel des Champs-Élysées', '123 Avenue des Champs-Élysées, 75008 Paris', 'ZI75008', 48.8698679, 2.3072976, 'https://zishop.co/hotel/ZI75008'),
('Le Grand Hôtel', '2 Rue Scribe, 75009 Paris', 'ZI75009', 48.8708679, 2.3312976, 'https://zishop.co/hotel/ZI75009'),
('Hôtel Marais', '12 Rue de Rivoli, 75004 Paris', 'ZI75004', 48.8558679, 2.3552976, 'https://zishop.co/hotel/ZI75004');

-- Insertion de commerçants de test
INSERT INTO merchants (name, address, category, latitude, longitude, rating, review_count, image_url) VALUES 
('Souvenirs de Paris', '45 Rue de Rivoli, 75001 Paris', 'Souvenirs', 48.8718679, 2.3082976, 4.8, 127, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100'),
('Art & Craft Paris', '78 Boulevard Saint-Germain, 75005 Paris', 'Artisanat', 48.8688679, 2.3102976, 4.2, 89, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100'),
('Galerie Française', '25 Rue du Louvre, 75001 Paris', 'Galerie', 48.8638679, 2.3122976, 4.9, 203, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100');

-- Insertion d'utilisateurs pour les hôtels et commerçants
INSERT INTO users (username, password, role, entity_id) VALUES 
('hotel1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'hotel', 1),
('hotel2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'hotel', 2),
('merchant1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'merchant', 1),
('merchant2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'merchant', 2);

-- Insertion de produits de test
INSERT INTO products (merchant_id, name, description, price, category, is_souvenir, origin, material, stock, validation_status) VALUES 
(1, 'Tour Eiffel Miniature', 'Réplique authentique de la Tour Eiffel en métal', 12.50, 'Monuments', true, 'France', 'Métal', 50, 'approved'),
(1, 'Magnet Paris', 'Magnet collector avec vues de Paris', 4.90, 'Magnets', true, 'France', 'Céramique', 100, 'approved'),
(1, 'Porte-clés Louvre', 'Porte-clés avec la pyramide du Louvre', 6.80, 'Porte-clés', true, 'France', 'Métal', 75, 'approved'),
(2, 'Artisanat Local', 'Poterie artisanale française', 24.90, 'Artisanat', true, 'France', 'Céramique', 30, 'approved'),
(2, 'Bijoux Artisanaux', 'Boucles d''oreilles faites main', 18.50, 'Bijoux', true, 'France', 'Argent', 20, 'approved'),
(3, 'Cartes Postales Vintage', 'Collection de cartes postales parisiennes', 8.80, 'Papeterie', true, 'France', 'Papier', 200, 'approved'),
(3, 'Livre d''Art Paris', 'Livre photographique sur Paris', 29.20, 'Livres', true, 'France', 'Papier', 25, 'approved');

-- Insertion d'associations hôtel-commerçant
INSERT INTO hotel_merchants (hotel_id, merchant_id) VALUES 
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 3),
(3, 2), (3, 3);

-- Insertion de clients de test
INSERT INTO clients (email, password, first_name, last_name, phone) VALUES 
('jean.dupont@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jean', 'Dupont', '06 12 34 56 78'),
('marie.martin@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Marie', 'Martin', '06 98 76 54 32');

-- ==================================================
-- 6. CONFIGURATION DES POLITIQUES RLS (Row Level Security)
-- ==================================================

-- Activer RLS sur les tables sensibles
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politiques pour les commandes (les clients ne voient que leurs commandes)
CREATE POLICY "Clients can view their own orders" ON orders
    FOR SELECT USING (client_id = auth.uid()::integer);

CREATE POLICY "Hotels can view their orders" ON orders
    FOR SELECT USING (hotel_id IN (
        SELECT entity_id FROM users WHERE id = auth.uid()::integer AND role = 'hotel'
    ));

CREATE POLICY "Merchants can view their orders" ON orders
    FOR SELECT USING (merchant_id IN (
        SELECT entity_id FROM users WHERE id = auth.uid()::integer AND role = 'merchant'
    ));

-- Politiques pour les produits (les commerçants ne gèrent que leurs produits)
CREATE POLICY "Merchants can manage their products" ON products
    FOR ALL USING (merchant_id IN (
        SELECT entity_id FROM users WHERE id = auth.uid()::integer AND role = 'merchant'
    ));

-- ==================================================
-- 7. VUES UTILES POUR LES STATISTIQUES
-- ==================================================

-- Vue pour les statistiques globales
CREATE VIEW admin_stats AS
SELECT 
    (SELECT COUNT(*) FROM hotels WHERE is_active = true) as active_hotels,
    (SELECT COUNT(*) FROM merchants WHERE is_open = true) as active_merchants,
    (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE) as today_orders,
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status NOT IN ('cancelled')) as total_revenue,
    (SELECT COALESCE(SUM(zishop_commission), 0) FROM orders WHERE status NOT IN ('cancelled')) as zishop_commission;

-- Vue pour les commandes avec détails
CREATE VIEW order_details AS
SELECT 
    o.*,
    h.name as hotel_name,
    h.address as hotel_address,
    m.name as merchant_name,
    m.category as merchant_category,
    c.first_name || ' ' || c.last_name as client_full_name,
    c.email as client_email
FROM orders o
LEFT JOIN hotels h ON o.hotel_id = h.id
LEFT JOIN merchants m ON o.merchant_id = m.id
LEFT JOIN clients c ON o.client_id = c.id;

-- ==================================================
-- SCRIPT TERMINÉ
-- ==================================================

-- Afficher un message de confirmation
SELECT 'Base de données ZiShop configurée avec succès!' as message,
       'Utilisateur admin créé: admin/password' as login_info,
       NOW() as setup_time; 