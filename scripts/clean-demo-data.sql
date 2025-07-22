-- Script de nettoyage des données demo
-- Supprime toutes les données de test et remet la base à zéro pour la production

-- Désactiver les contraintes de clé étrangère temporairement
PRAGMA foreign_keys = OFF;

-- Supprimer toutes les commandes existantes
DELETE FROM orders;

-- Supprimer toutes les relations hôtel-commerçant
DELETE FROM hotel_merchants;

-- Supprimer tous les produits
DELETE FROM products;

-- Supprimer tous les clients de test
DELETE FROM clients;

-- Supprimer tous les commerçants de demo
DELETE FROM merchants;

-- Supprimer tous les hôtels de demo
DELETE FROM hotels;

-- Supprimer tous les utilisateurs administratifs de demo
DELETE FROM users;

-- Réactiver les contraintes de clé étrangère
PRAGMA foreign_keys = ON;

-- Reset des séquences auto-increment
DELETE FROM sqlite_sequence WHERE name IN ('hotels', 'merchants', 'products', 'orders', 'clients', 'users', 'hotel_merchants');

-- Créer un utilisateur admin par défaut
INSERT INTO users (username, password, role, entity_id) VALUES 
('admin', '$2a$10$hashpassword', 'admin', NULL);

-- Afficher le résultat du nettoyage
SELECT 
    'Nettoyage terminé' as status,
    (SELECT COUNT(*) FROM hotels) as hotels_count,
    (SELECT COUNT(*) FROM merchants) as merchants_count,
    (SELECT COUNT(*) FROM products) as products_count,
    (SELECT COUNT(*) FROM orders) as orders_count,
    (SELECT COUNT(*) FROM clients) as clients_count,
    (SELECT COUNT(*) FROM users) as users_count;

-- Messages de confirmation
SELECT 'Base de données nettoyée avec succès' as message;
SELECT 'Toutes les données demo ont été supprimées' as message;
SELECT 'Un utilisateur admin par défaut a été créé' as message;
SELECT 'La base est prête pour la production' as message; 