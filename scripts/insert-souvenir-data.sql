-- ======================================
-- DONNÉES ZISHOP SOUVENIRS
-- ======================================

-- Vider les tables
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE products CASCADE; 
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE merchants RESTART IDENTITY CASCADE;
TRUNCATE TABLE hotels RESTART IDENTITY CASCADE;

-- Désactiver RLS
ALTER TABLE hotels DISABLE ROW LEVEL SECURITY;
ALTER TABLE merchants DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 1. Hôtels Partenaires
INSERT INTO hotels (name, address, code, latitude, longitude, qr_code, is_active, image_url) VALUES
('Novotel Paris Vaugirard Montparnasse', '257 Rue de Vaugirard, 75015 Paris', 'NPV001', 48.8414, 2.2970, 'NPV001_QR_CODE', true, 'hotels/novotel-vaugirard.jpg'),
('Hôtel Mercure Paris Boulogne', '78 Avenue Edouard Vaillant, 92100 Boulogne-Billancourt', 'MPB002', 48.8354, 2.2463, 'MPB002_QR_CODE', true, 'hotels/mercure-boulogne.jpg'),
('ibis Paris La Défense Esplanade', '4 Boulevard de Neuilly, 92400 Courbevoie', 'IPD003', 48.8917, 2.2361, 'IPD003_QR_CODE', true, 'hotels/ibis-defense.jpg'),
('Novotel Paris la Défense Esplanade', '2 Boulevard de Neuilly, 92400 Courbevoie', 'NDE004', 48.8920, 2.2355, 'NDE004_QR_CODE', true, 'hotels/novotel-defense.jpg');

-- 2. Boutiques de Souvenirs
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

-- 3. Produits Souvenirs
INSERT INTO products (merchant_id, name, description, price, image_url, is_available, category, is_souvenir, origin, material) VALUES
-- Paris Memories Montparnasse
((SELECT id FROM merchants WHERE name = 'Paris Memories Montparnasse'), 'Tour Eiffel Deluxe', 'Réplique premium de la Tour Eiffel en métal doré', 49.90, 'products/tour-eiffel-deluxe.jpg', true, 'Monuments', true, 'France', 'Métal doré'),
((SELECT id FROM merchants WHERE name = 'Paris Memories Montparnasse'), 'Set Art de Vivre Parisien', 'Coffret gastronomie avec produits français', 79.90, 'products/set-art-vivre.jpg', true, 'Gastronomie', true, 'France', 'Divers'),

-- Art & Collection Tour Eiffel
((SELECT id FROM merchants WHERE name = 'Art & Collection Tour Eiffel'), 'Reproduction Musée d''Orsay', 'Reproduction d''art premium', 129.90, 'products/reproduction-orsay.jpg', true, 'Art', true, 'France', 'Toile'),
((SELECT id FROM merchants WHERE name = 'Art & Collection Tour Eiffel'), 'Collection Monuments Paris', 'Set de 5 miniatures monuments parisiens', 89.90, 'products/collection-monuments.jpg', true, 'Collections', true, 'France', 'Résine'),

-- French Luxury Gifts
((SELECT id FROM merchants WHERE name = 'French Luxury Gifts'), 'Foulard Soie Paris', 'Foulard en soie motifs parisiens', 159.90, 'products/foulard-soie.jpg', true, 'Mode', true, 'France', 'Soie'),
((SELECT id FROM merchants WHERE name = 'French Luxury Gifts'), 'Coffret Parfum Paris', 'Coffret parfum exclusif', 199.90, 'products/coffret-parfum.jpg', true, 'Parfumerie', true, 'France', 'Verre'),

-- Boulogne Artisanat
((SELECT id FROM merchants WHERE name = 'Boulogne Artisanat'), 'Tableau Paris Artisanal', 'Tableau fait main Paris', 149.90, 'products/tableau-paris.jpg', true, 'Art', true, 'France', 'Mixte'),
((SELECT id FROM merchants WHERE name = 'Boulogne Artisanat'), 'Bijoux Tour Eiffel', 'Bijoux artisanaux motif Tour Eiffel', 69.90, 'products/bijoux-paris.jpg', true, 'Bijoux', true, 'France', 'Argent'),

-- Collection Paris Ouest
((SELECT id FROM merchants WHERE name = 'Collection Paris Ouest'), 'Paris Photo Book', 'Livre photos collector Paris', 89.90, 'products/photo-book.jpg', true, 'Livres', true, 'France', 'Papier'),
((SELECT id FROM merchants WHERE name = 'Collection Paris Ouest'), 'Montre Paris Edition', 'Montre édition limitée Paris', 249.90, 'products/montre-paris.jpg', true, 'Accessoires', true, 'France', 'Acier'),

-- La Défense Souvenirs
((SELECT id FROM merchants WHERE name = 'La Défense Souvenirs'), 'Poster Art La Défense', 'Poster collector La Défense', 39.90, 'products/poster-defense.jpg', true, 'Décoration', true, 'France', 'Papier'),
((SELECT id FROM merchants WHERE name = 'La Défense Souvenirs'), 'Mug Collection Paris', 'Set de mugs design Paris', 45.90, 'products/mug-collection.jpg', true, 'Accessoires', true, 'France', 'Céramique'),

-- Paris Premium Gifts
((SELECT id FROM merchants WHERE name = 'Paris Premium Gifts'), 'Stylo Luxe Paris', 'Stylo collector Paris', 129.90, 'products/stylo-paris.jpg', true, 'Papeterie', true, 'France', 'Métal précieux'),
((SELECT id FROM merchants WHERE name = 'Paris Premium Gifts'), 'Maroquinerie Paris', 'Portefeuille cuir collection Paris', 189.90, 'products/maroquinerie-paris.jpg', true, 'Maroquinerie', true, 'France', 'Cuir'),

-- Art de France La Défense
((SELECT id FROM merchants WHERE name = 'Art de France La Défense'), 'Sculpture Modern Paris', 'Sculpture moderne Paris', 299.90, 'products/sculpture-paris.jpg', true, 'Art', true, 'France', 'Bronze'),
((SELECT id FROM merchants WHERE name = 'Art de France La Défense'), 'Lithographie Paris', 'Lithographie numérotée Paris', 199.90, 'products/lithographie-paris.jpg', true, 'Art', true, 'France', 'Papier');

-- 4. Utilisateurs
INSERT INTO users (username, password, role, entity_id) VALUES
('admin', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'admin', null),
('manager_hotels', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'admin', null),
('manager_souvenirs', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'admin', null),

-- Hôtels
('hotel_novotel_vaugirard', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'hotel', (SELECT id FROM hotels WHERE code = 'NPV001')),
('hotel_mercure_boulogne', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'hotel', (SELECT id FROM hotels WHERE code = 'MPB002')),
('hotel_ibis_defense', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'hotel', (SELECT id FROM hotels WHERE code = 'IPD003')),
('hotel_novotel_defense', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'hotel', (SELECT id FROM hotels WHERE code = 'NDE004')),

-- Marchands
('paris_memories', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'merchant', (SELECT id FROM merchants WHERE name = 'Paris Memories Montparnasse')),
('art_collection', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'merchant', (SELECT id FROM merchants WHERE name = 'Art & Collection Tour Eiffel')),
('luxury_gifts', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'merchant', (SELECT id FROM merchants WHERE name = 'French Luxury Gifts'));

-- 5. Commande exemple
INSERT INTO orders (hotel_id, merchant_id, order_number, customer_name, customer_room, items, total_amount, status) VALUES
((SELECT id FROM hotels WHERE code = 'NPV001'), 
 (SELECT id FROM merchants WHERE name = 'Paris Memories Montparnasse'), 
 'ORD-2024-001', 
 'John Smith', 
 '405', 
 '[
    {"product_id": 1, "name": "Tour Eiffel Deluxe", "price": 49.90, "quantity": 1},
    {"product_id": 2, "name": "Set Art de Vivre Parisien", "price": 79.90, "quantity": 1}
 ]'::jsonb, 
 129.80, 
 'pending');

-- Réactiver RLS
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Vérification finale
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