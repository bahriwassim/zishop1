-- ======================================
-- CORRECTION COMPLÈTE DU SCHÉMA ET INSERTION
-- ======================================

-- 1. AJOUTER LES COLONNES MANQUANTES
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS description TEXT;

-- 2. DÉSACTIVER RLS TEMPORAIREMENT POUR L'INSERTION
ALTER TABLE hotels DISABLE ROW LEVEL SECURITY;
ALTER TABLE merchants DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 3. VIDER ET INSÉRER LES DONNÉES SOUVENIRS
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE products CASCADE; 
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE merchants RESTART IDENTITY CASCADE;
TRUNCATE TABLE hotels RESTART IDENTITY CASCADE;

-- 4. INSÉRER LES DONNÉES

-- Hôtels Partenaires
INSERT INTO hotels (name, address, code, latitude, longitude, qr_code, is_active, image_url, description) VALUES
('Novotel Paris Vaugirard Montparnasse', '257 Rue de Vaugirard, 75015 Paris', 'NPV001', 48.8414, 2.2970, 'NPV001_QR_CODE', true, 'hotels/novotel-vaugirard.jpg', 'Hôtel moderne dans le 15e arrondissement, proche de la Tour Montparnasse'),
('Hôtel Mercure Paris Boulogne', '78 Avenue Edouard Vaillant, 92100 Boulogne-Billancourt', 'MPB002', 48.8354, 2.2463, 'MPB002_QR_CODE', true, 'hotels/mercure-boulogne.jpg', 'Hôtel élégant à Boulogne-Billancourt, accès facile au centre de Paris'),
('ibis Paris La Défense Esplanade', '4 Boulevard de Neuilly, 92400 Courbevoie', 'IPD003', 48.8917, 2.2361, 'IPD003_QR_CODE', true, 'hotels/ibis-defense.jpg', 'Hôtel pratique au cœur du quartier d''affaires de La Défense'),
('Novotel Paris la Défense Esplanade', '2 Boulevard de Neuilly, 92400 Courbevoie', 'NDE004', 48.8920, 2.2355, 'NDE004_QR_CODE', true, 'hotels/novotel-defense.jpg', 'Hôtel haut de gamme avec vue sur l''Arche de la Défense');

-- Boutiques de Souvenirs
INSERT INTO merchants (name, address, category, latitude, longitude, rating, review_count, is_open, image_url, description) VALUES
-- Zone Montparnasse
('Paris Memories Montparnasse', '250 Rue de Vaugirard, 75015 Paris', 'Souvenirs Traditionnels', 48.8415, 2.2972, 4.5, 128, true, 'merchants/paris-memories.jpg', 'Souvenirs traditionnels parisiens et produits artisanaux français'),
('Art & Collection Tour Eiffel', 'Avenue de Suffren, 75015 Paris', 'Art & Collections', 48.8558, 2.2954, 4.7, 156, true, 'merchants/art-collection.jpg', 'Reproductions d''art, miniatures et collections exclusives'),
('French Luxury Gifts', '25 Rue du Commerce, 75015 Paris', 'Cadeaux Luxe', 48.8472, 2.2934, 4.8, 92, true, 'merchants/luxury-gifts.jpg', 'Souvenirs haut de gamme et articles de luxe français'),

-- Zone Boulogne
('Boulogne Artisanat', '80 Avenue Edouard Vaillant, 92100 Boulogne', 'Artisanat Local', 48.8356, 2.2465, 4.6, 108, true, 'merchants/boulogne-artisanat.jpg', 'Artisanat local et souvenirs faits main'),
('Collection Paris Ouest', '12 Route de la Reine, 92100 Boulogne', 'Souvenirs Design', 48.8352, 2.2445, 4.4, 75, true, 'merchants/paris-ouest.jpg', 'Souvenirs design et contemporains'),

-- Zone La Défense
('La Défense Souvenirs', 'Centre Commercial Les 4 Temps, 92092 La Défense', 'Souvenirs Modernes', 48.8918, 2.2362, 4.3, 203, true, 'merchants/defense-souvenirs.jpg', 'Souvenirs modernes et cadeaux d''entreprise'),
('Paris Premium Gifts', 'Parvis de la Défense, 92800 Puteaux', 'Cadeaux Premium', 48.8917, 2.2358, 4.9, 167, true, 'merchants/premium-gifts.jpg', 'Cadeaux premium et souvenirs exclusifs'),
('Art de France La Défense', '17 Esplanade du Général de Gaulle, 92092 La Défense', 'Art Français', 48.8912, 2.2365, 4.5, 142, true, 'merchants/art-france.jpg', 'Art français et souvenirs culturels');

-- Produits Souvenirs
INSERT INTO products (merchant_id, name, description, price, image_url, is_available, category, is_souvenir, origin, material) VALUES
-- Paris Memories Montparnasse
(1, 'Tour Eiffel Deluxe', 'Réplique premium de la Tour Eiffel en métal doré', 49.90, 'products/tour-eiffel-deluxe.jpg', true, 'Monuments', true, 'France', 'Métal doré'),
(1, 'Set Art de Vivre Parisien', 'Coffret gastronomie avec produits français', 79.90, 'products/set-art-vivre.jpg', true, 'Gastronomie', true, 'France', 'Divers'),

-- Art & Collection Tour Eiffel
(2, 'Reproduction Musée d''Orsay', 'Reproduction d''art premium', 129.90, 'products/reproduction-orsay.jpg', true, 'Art', true, 'France', 'Toile'),
(2, 'Collection Monuments Paris', 'Set de 5 miniatures monuments parisiens', 89.90, 'products/collection-monuments.jpg', true, 'Collections', true, 'France', 'Résine'),

-- French Luxury Gifts
(3, 'Foulard Soie Paris', 'Foulard en soie motifs parisiens', 159.90, 'products/foulard-soie.jpg', true, 'Mode', true, 'France', 'Soie'),
(3, 'Coffret Parfum Paris', 'Coffret parfum exclusif', 199.90, 'products/coffret-parfum.jpg', true, 'Parfumerie', true, 'France', 'Verre'),

-- Boulogne Artisanat
(4, 'Tableau Paris Artisanal', 'Tableau fait main Paris', 149.90, 'products/tableau-paris.jpg', true, 'Art', true, 'France', 'Mixte'),
(4, 'Bijoux Tour Eiffel', 'Bijoux artisanaux motif Tour Eiffel', 69.90, 'products/bijoux-paris.jpg', true, 'Bijoux', true, 'France', 'Argent'),

-- Collection Paris Ouest
(5, 'Paris Photo Book', 'Livre photos collector Paris', 89.90, 'products/photo-book.jpg', true, 'Livres', true, 'France', 'Papier'),
(5, 'Montre Paris Edition', 'Montre édition limitée Paris', 249.90, 'products/montre-paris.jpg', true, 'Accessoires', true, 'France', 'Acier'),

-- La Défense Souvenirs
(6, 'Poster Art La Défense', 'Poster collector La Défense', 39.90, 'products/poster-defense.jpg', true, 'Décoration', true, 'France', 'Papier'),
(6, 'Mug Collection Paris', 'Set de mugs design Paris', 45.90, 'products/mug-collection.jpg', true, 'Accessoires', true, 'France', 'Céramique'),

-- Paris Premium Gifts
(7, 'Stylo Luxe Paris', 'Stylo collector Paris', 129.90, 'products/stylo-paris.jpg', true, 'Papeterie', true, 'France', 'Métal précieux'),
(7, 'Maroquinerie Paris', 'Portefeuille cuir collection Paris', 189.90, 'products/maroquinerie-paris.jpg', true, 'Maroquinerie', true, 'France', 'Cuir'),

-- Art de France La Défense
(8, 'Sculpture Modern Paris', 'Sculpture moderne Paris', 299.90, 'products/sculpture-paris.jpg', true, 'Art', true, 'France', 'Bronze'),
(8, 'Lithographie Paris', 'Lithographie numérotée Paris', 199.90, 'products/lithographie-paris.jpg', true, 'Art', true, 'France', 'Papier');

-- Utilisateurs
INSERT INTO users (username, password, role, entity_id) VALUES
('admin', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'admin', null),
('manager_hotels', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'admin', null),
('manager_souvenirs', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'admin', null),

-- Hôtels
('hotel_novotel_vaugirard', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'hotel', 1),
('hotel_mercure_boulogne', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'hotel', 2),
('hotel_ibis_defense', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'hotel', 3),
('hotel_novotel_defense', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'hotel', 4),

-- Marchands
('paris_memories', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'merchant', 1),
('art_collection', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'merchant', 2),
('luxury_gifts', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'merchant', 3);

-- Commande exemple
INSERT INTO orders (hotel_id, merchant_id, order_number, customer_name, customer_room, items, total_amount, status) VALUES
(1, 1, 'ORD-2024-001', 'John Smith', '405', 
 '[
    {"product_id": 1, "name": "Tour Eiffel Deluxe", "price": 49.90, "quantity": 1},
    {"product_id": 2, "name": "Set Art de Vivre Parisien", "price": 79.90, "quantity": 1}
 ]'::jsonb, 
 129.80, 'pending');

-- 5. RÉACTIVER RLS AVEC POLITIQUES PUBLIQUES
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politiques permissives pour la lecture publique
DROP POLICY IF EXISTS "Enable read access for all users" ON hotels;
CREATE POLICY "Enable read access for all users" ON hotels FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON merchants;
CREATE POLICY "Enable read access for all users" ON merchants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON products;
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);

-- Politiques pour les commandes (lecture publique pour demo)
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;
CREATE POLICY "Enable read access for all users" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for all users" ON orders;
CREATE POLICY "Enable insert for all users" ON orders FOR INSERT WITH CHECK (true);

-- Politique pour les utilisateurs (lecture restreinte)
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON users;
CREATE POLICY "Enable read access for authenticated users only" ON users FOR SELECT USING (auth.role() = 'authenticated');

-- 6. VÉRIFICATION FINALE
SELECT 'RÉSUMÉ DES DONNÉES:' as info;
SELECT 
  'Hôtels' as type, 
  count(*) as nombre,
  string_agg(name, ', ') as liste
FROM hotels
UNION ALL
SELECT 
  'Boutiques de Souvenirs',
  count(*),
  string_agg(name, ', ')
FROM merchants
UNION ALL
SELECT 
  'Produits Souvenirs',
  count(*),
  string_agg(name, ', ')
FROM products
UNION ALL
SELECT 
  'Utilisateurs',
  count(*),
  string_agg(username, ', ')
FROM users;

-- Afficher les catégories de souvenirs
SELECT 'CATÉGORIES DE SOUVENIRS:' as info;
SELECT DISTINCT category, count(*) as nombre
FROM products
GROUP BY category
ORDER BY count(*) DESC; 