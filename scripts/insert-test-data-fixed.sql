-- ======================================
-- INSERTION DES DONNÉES DE TEST (SOUVENIRS)
-- ZiShop E-commerce Hotel System
-- ======================================

-- Vider les tables dans le bon ordre (cascades)
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE products CASCADE; 
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE merchants RESTART IDENTITY CASCADE;
TRUNCATE TABLE hotels RESTART IDENTITY CASCADE;

-- Désactiver temporairement RLS pour l'insertion
ALTER TABLE hotels DISABLE ROW LEVEL SECURITY;
ALTER TABLE merchants DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 1. Insérer les hôtels parisiens
INSERT INTO hotels (name, address, code, latitude, longitude, qr_code, is_active) VALUES
('Novotel Paris Vaugirard Montparnasse', '257 Rue de Vaugirard, 75015 Paris', 'NPV001', 48.8414, 2.2970, 'NPV001_QR_CODE_DATA', true),
('Hôtel Mercure Paris Boulogne', '78 Avenue Edouard Vaillant, 92100 Boulogne-Billancourt', 'MPB002', 48.8354, 2.2463, 'MPB002_QR_CODE_DATA', true),
('ibis Paris La Défense Esplanade', '4 Boulevard de Neuilly, 92400 Courbevoie', 'IPD003', 48.8917, 2.2361, 'IPD003_QR_CODE_DATA', true),
('Novotel Paris la Défense Esplanade', '2 Boulevard de Neuilly, 92400 Courbevoie', 'NDE004', 48.8920, 2.2355, 'NDE004_QR_CODE_DATA', true);

-- 2. Insérer les boutiques de souvenirs
INSERT INTO merchants (name, address, category, latitude, longitude, rating, review_count, is_open, image_url) VALUES
('Souvenirs Tour Eiffel', 'Avenue de Suffren, 75015 Paris', 'Souvenirs Parisiens', 48.8558, 2.2954, 4.7, 245, true, 'https://via.placeholder.com/300x200?text=Souvenirs+Tour+Eiffel'),
('Paris Memories', '15 Rue du Commerce, 75015 Paris', 'Souvenirs Artisanaux', 48.8470, 2.2890, 4.5, 189, true, 'https://via.placeholder.com/300x200?text=Paris+Memories'),
('Artisanat de Montmartre', '2 Place du Tertre, 75018 Paris', 'Art & Souvenirs', 48.8865, 2.3403, 4.8, 312, true, 'https://via.placeholder.com/300x200?text=Artisanat+Montmartre'),
('Boutique du Marais', '35 Rue des Rosiers, 75004 Paris', 'Cadeaux Parisiens', 48.8571, 2.3625, 4.6, 178, true, 'https://via.placeholder.com/300x200?text=Boutique+Marais'),
('Galerie des Souvenirs', 'Centre Commercial Les Quatre Temps, 92400 Courbevoie', 'Souvenirs Luxe', 48.8925, 2.2365, 4.4, 156, true, 'https://via.placeholder.com/300x200?text=Galerie+Souvenirs');

-- 3. Insérer les produits souvenirs
INSERT INTO products (merchant_id, name, description, price, image_url, is_available, category, is_souvenir, origin, material) VALUES
-- Souvenirs Tour Eiffel
((SELECT id FROM merchants WHERE name = 'Souvenirs Tour Eiffel'), 'Tour Eiffel Lumineuse', 'Tour Eiffel miniature avec LED intégrées, 25cm', 29.90, 'https://via.placeholder.com/300x300?text=Tour+Eiffel+LED', true, 'Monuments', true, 'France', 'Métal & LED'),
((SELECT id FROM merchants WHERE name = 'Souvenirs Tour Eiffel'), 'Set Tour Eiffel Collector', 'Collection de 3 tours Eiffel différentes tailles', 45.00, 'https://via.placeholder.com/300x300?text=Set+Tour+Eiffel', true, 'Monuments', true, 'France', 'Métal doré'),
((SELECT id FROM merchants WHERE name = 'Souvenirs Tour Eiffel'), 'Boule à Neige Paris', 'Boule à neige avec monuments parisiens', 19.90, 'https://via.placeholder.com/300x300?text=Boule+Neige', true, 'Décorations', true, 'France', 'Verre & Résine'),

-- Paris Memories
((SELECT id FROM merchants WHERE name = 'Paris Memories'), 'Béret Parisien', 'Béret traditionnel français en laine', 24.90, 'https://via.placeholder.com/300x300?text=Beret', true, 'Mode', true, 'France', 'Laine'),
((SELECT id FROM merchants WHERE name = 'Paris Memories'), 'Set Macarons Factices', 'Reproduction parfaite de macarons parisiens', 15.90, 'https://via.placeholder.com/300x300?text=Macarons', true, 'Décorations', true, 'France', 'Résine'),
((SELECT id FROM merchants WHERE name = 'Paris Memories'), 'Plaque Émaillée Métro', 'Reproduction plaque métro parisien personnalisable', 34.90, 'https://via.placeholder.com/300x300?text=Plaque+Metro', true, 'Décorations', true, 'France', 'Émail'),

-- Artisanat de Montmartre
((SELECT id FROM merchants WHERE name = 'Artisanat de Montmartre'), 'Portrait au Fusain', 'Portrait artistique style Montmartre', 50.00, 'https://via.placeholder.com/300x300?text=Portrait', true, 'Art', true, 'France', 'Fusain'),
((SELECT id FROM merchants WHERE name = 'Artisanat de Montmartre'), 'Aquarelle de Paris', 'Vue de Paris peinte à l''aquarelle', 45.00, 'https://via.placeholder.com/300x300?text=Aquarelle', true, 'Art', true, 'France', 'Aquarelle'),
((SELECT id FROM merchants WHERE name = 'Artisanat de Montmartre'), 'Set Cartes Postales Artistiques', '10 cartes postales d''artistes de Montmartre', 12.90, 'https://via.placeholder.com/300x300?text=Cartes+Postales', true, 'Art', true, 'France', 'Papier'),

-- Boutique du Marais
((SELECT id FROM merchants WHERE name = 'Boutique du Marais'), 'Parfum "Paris Je T''aime"', 'Parfum exclusif aux notes parisiennes', 55.00, 'https://via.placeholder.com/300x300?text=Parfum', true, 'Parfums', true, 'France', 'Verre'),
((SELECT id FROM merchants WHERE name = 'Boutique du Marais'), 'Sac "Paris Fashion"', 'Sac en toile avec motifs parisiens', 29.90, 'https://via.placeholder.com/300x300?text=Sac', true, 'Mode', true, 'France', 'Toile'),
((SELECT id FROM merchants WHERE name = 'Boutique du Marais'), 'Bijou Tour Eiffel', 'Collier plaqué or motif Tour Eiffel', 39.90, 'https://via.placeholder.com/300x300?text=Bijou', true, 'Bijoux', true, 'France', 'Plaqué Or'),

-- Galerie des Souvenirs
((SELECT id FROM merchants WHERE name = 'Galerie des Souvenirs'), 'Montre Paris Luxe', 'Montre avec cadran monuments de Paris', 89.90, 'https://via.placeholder.com/300x300?text=Montre', true, 'Accessoires', true, 'France', 'Acier & Cuir'),
((SELECT id FROM merchants WHERE name = 'Galerie des Souvenirs'), 'Foulard "Paris Chic"', 'Foulard en soie motifs parisiens', 69.90, 'https://via.placeholder.com/300x300?text=Foulard', true, 'Mode', true, 'France', 'Soie'),
((SELECT id FROM merchants WHERE name = 'Galerie des Souvenirs'), 'Stylo Tour Eiffel', 'Stylo de luxe avec Tour Eiffel en or', 49.90, 'https://via.placeholder.com/300x300?text=Stylo', true, 'Papeterie', true, 'France', 'Métal précieux');

-- 4. Insérer les utilisateurs de test
INSERT INTO users (username, password, role, entity_id) VALUES
('admin', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'admin', null),
('hotel_novotel_vaugirard', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'hotel', (SELECT id FROM hotels WHERE code = 'NPV001')),
('hotel_mercure_boulogne', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'hotel', (SELECT id FROM hotels WHERE code = 'MPB002')),
('merchant_tour_eiffel', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'merchant', (SELECT id FROM merchants WHERE name = 'Souvenirs Tour Eiffel')),
('merchant_montmartre', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'merchant', (SELECT id FROM merchants WHERE name = 'Artisanat de Montmartre'));

-- 5. Insérer une commande de test
INSERT INTO orders (hotel_id, merchant_id, order_number, customer_name, customer_room, items, total_amount, status) VALUES
((SELECT id FROM hotels WHERE code = 'NPV001'), 
 (SELECT id FROM merchants WHERE name = 'Souvenirs Tour Eiffel'), 
 'ORD-2024-001-0001', 
 'John Smith', 
 '205', 
 '[{"product_id": 1, "name": "Tour Eiffel Lumineuse", "price": 29.90, "quantity": 1}, {"product_id": 3, "name": "Boule à Neige Paris", "price": 19.90, "quantity": 2}]'::jsonb, 
 69.70, 
 'pending');

-- Réactiver RLS
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Vérification des données insérées
SELECT 'Données insérées avec succès !' as message;

-- Résumé des données
SELECT 'RÉSUMÉ DES DONNÉES:' as info;
SELECT 
  'Hotels' as table_name, 
  count(*) as nombre, 
  string_agg(name, ', ') as details
FROM hotels
UNION ALL
SELECT 
  'Boutiques de Souvenirs', 
  count(*), 
  string_agg(name, ', ')
FROM merchants  
UNION ALL
SELECT 
  'Souvenirs', 
  count(*), 
  string_agg(name, ', ')
FROM products
UNION ALL
SELECT 
  'Users', 
  count(*), 
  string_agg(username, ', ')
FROM users
UNION ALL
SELECT 
  'Orders', 
  count(*), 
  string_agg(order_number, ', ')
FROM orders;

-- Afficher les boutiques avec leurs produits
SELECT 'CATALOGUE DES SOUVENIRS:' as info;
SELECT 
  m.name as boutique,
  p.name as souvenir,
  p.price as prix,
  p.category as categorie,
  p.material as materiau
FROM products p
JOIN merchants m ON p.merchant_id = m.id
ORDER BY m.name, p.price; 