-- ======================================
-- INSERTION DES DONNÉES DE TEST
-- ZiShop E-commerce Hotel System
-- ======================================

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
('Novotel Paris la Défense Esplanade', '2 Boulevard de Neuilly, 92400 Courbevoie', 'NDE004', 48.8920, 2.2355, 'NDE004_QR_CODE_DATA', true)
ON CONFLICT (code) DO NOTHING;

-- 2. Insérer les marchands autour des hôtels parisiens
INSERT INTO merchants (name, address, category, latitude, longitude, rating, review_count, is_open, image_url) VALUES
('Boulangerie Du Coin Montparnasse', '245 Rue de Vaugirard, 75015 Paris', 'Boulangerie', 48.8412, 2.2975, 4.5, 128, true, 'https://via.placeholder.com/300x200?text=Boulangerie+Montparnasse'),
('Boutique Souvenirs Tour Eiffel', 'Avenue de Suffren, 75015 Paris', 'Souvenirs', 48.8558, 2.2954, 4.2, 89, true, 'https://via.placeholder.com/300x200?text=Souvenirs+Eiffel'),
('Café de la Défense', 'Parvis de la Défense, 92400 Courbevoie', 'Restaurant', 48.8922, 2.2358, 4.0, 245, true, 'https://via.placeholder.com/300x200?text=Cafe+Defense'),
('Maison des Macarons Boulogne', 'Avenue Edouard Vaillant, 92100 Boulogne-Billancourt', 'Pâtisserie', 48.8350, 2.2470, 4.7, 156, true, 'https://via.placeholder.com/300x200?text=Macarons+Boulogne'),
('Pharmacie Grande Arche', 'Centre Commercial Les Quatre Temps, 92400 Courbevoie', 'Pharmacie', 48.8925, 2.2365, 4.3, 78, true, 'https://via.placeholder.com/300x200?text=Pharmacie+Defense'),
('Épicerie Fine Montparnasse', '15 Rue du Départ, 75015 Paris', 'Épicerie', 48.8422, 2.3221, 4.1, 92, true, 'https://via.placeholder.com/300x200?text=Epicerie+Montparnasse');

-- 3. Insérer les produits
INSERT INTO products (merchant_id, name, description, price, image_url, is_available, category, is_souvenir, origin, material) VALUES
-- Produits Boulangerie Du Coin Montparnasse (merchant_id=1)
(1, 'Croissant aux Amandes', 'Délicieux croissant aux amandes fraîchement préparé', 3.50, 'https://via.placeholder.com/300x300?text=Croissant', true, 'Viennoiserie', false, null, null),
(1, 'Baguette Tradition', 'Baguette artisanale selon la tradition française', 1.20, 'https://via.placeholder.com/300x300?text=Baguette', true, 'Pain', false, null, null),

-- Produits Boutique Souvenirs Tour Eiffel (merchant_id=2)
(2, 'Tour Eiffel Miniature', 'Réplique miniature de la Tour Eiffel en métal', 12.90, 'https://via.placeholder.com/300x300?text=Tour+Eiffel', true, 'Souvenirs', true, 'France', 'Métal'),
(2, 'Porte-clés Paris', 'Porte-clés avec monuments parisiens', 5.90, 'https://via.placeholder.com/300x300?text=Porte-cles', true, 'Souvenirs', true, 'France', 'Plastique'),

-- Produits Café de la Défense (merchant_id=3)
(3, 'Salade Lyonnaise', 'Salade traditionnelle lyonnaise avec lardons et œuf poché', 14.50, 'https://via.placeholder.com/300x300?text=Salade+Lyonnaise', true, 'Plat principal', false, null, null),
(3, 'Café Espresso', 'Café espresso italien', 2.80, 'https://via.placeholder.com/300x300?text=Espresso', true, 'Boisson', false, null, null),

-- Produits Maison des Macarons Boulogne (merchant_id=4)
(4, 'Macarons au Chocolat', 'Macarons au chocolat au beurre de cacahuète', 5.90, 'https://via.placeholder.com/300x300?text=Macarons+Chocolat', true, 'Pâtisserie', true, 'France', 'Chocolat'),
(4, 'Macarons au Citron', 'Macarons au citron avec une mousse au citron', 5.90, 'https://via.placeholder.com/300x300?text=Macarons+Citron', true, 'Pâtisserie', true, 'France', 'Citron'),

-- Produits Pharmacie Grande Arche (merchant_id=5)
(5, 'Savon de Marseille', 'Authentique savon de Marseille artisanal', 8.90, 'https://via.placeholder.com/300x300?text=Savon+Marseille', true, 'Cosmétique', true, 'Provence', 'Huile d''olive'),
(5, 'Lavande de Provence', 'Bouquet de lavande séchée de Provence', 6.50, 'https://via.placeholder.com/300x300?text=Lavande', true, 'Décoration', true, 'Provence', 'Naturel'),

-- Produits Épicerie Fine Montparnasse (merchant_id=6)
(6, 'Pain au Chocolat', 'Pain au chocolat avec une mousse au chocolat', 2.50, 'https://via.placeholder.com/300x300?text=Pain+Chocolat', true, 'Boulangerie', false, null, null),
(6, 'Croissant au Chocolat', 'Croissant au chocolat avec une mousse au chocolat', 2.20, 'https://via.placeholder.com/300x300?text=Croissant+Chocolat', true, 'Viennoiserie', false, null, null);

-- 4. Insérer les utilisateurs de test (mots de passe hashés avec bcrypt)
INSERT INTO users (username, password, role, entity_id) VALUES
('admin', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'admin', null),
('hotel_novotel_vaugirard', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'hotel', 1),
('hotel_mercure_boulogne', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'hotel', 2),
('merchant_boulangerie', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'merchant', 1),
('merchant_souvenirs', '$2b$10$rQv.zFqt5FqIQqK5H9wJnuJ8kx8mGqK5.v5K8x8mGqK5.v5K8x8mG', 'merchant', 2)
ON CONFLICT (username) DO NOTHING;

-- 5. Insérer une commande de test
INSERT INTO orders (hotel_id, merchant_id, order_number, customer_name, customer_room, items, total_amount, status) VALUES
(1, 1, 'ORD-2024-001-0001', 'Jean Dupont', '205', 
'[{"product_id": 1, "name": "Croissant aux Amandes", "price": 3.50, "quantity": 2}, {"product_id": 2, "name": "Baguette Tradition", "price": 1.20, "quantity": 1}]'::jsonb, 
8.20, 'pending')
ON CONFLICT (order_number) DO NOTHING;

-- Réactiver RLS
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Vérification des données insérées
SELECT 'Données insérées avec succès !' as message;

SELECT 'Hôtels:' as type, count(*) as nombre FROM hotels
UNION ALL
SELECT 'Marchands:', count(*) FROM merchants  
UNION ALL
SELECT 'Produits:', count(*) FROM products
UNION ALL
SELECT 'Utilisateurs:', count(*) FROM users
UNION ALL
SELECT 'Commandes:', count(*) FROM orders;

-- Afficher les hôtels créés
SELECT 'HÔTELS CRÉÉS:' as info;
SELECT id, name, code, address FROM hotels ORDER BY id; 