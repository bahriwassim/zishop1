-- =====================================================
-- GÉNÉRATEUR RAPIDE D'UTILISATEURS DE TEST
-- Application ZiShop - Version Simplifiée
-- =====================================================

-- Création rapide des utilisateurs essentiels
INSERT INTO users (username, password, role, entity_id, created_at, updated_at)
VALUES 
    ('admin_zishop', '$2b$10$hash.simule.pour.test', 'admin', NULL, NOW(), NOW()),
    ('hotel_test', '$2b$10$hash.simule.pour.test', 'hotel', 1, NOW(), NOW()),
    ('merchant_test', '$2b$10$hash.simule.pour.test', 'merchant', 1, NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- Création rapide de clients de test
INSERT INTO clients (email, password, first_name, last_name, phone, is_active, has_completed_tutorial, created_at, updated_at)
VALUES 
    ('test.client@email.com', '$2b$10$hash.simule.pour.test', 'Test', 'Client', '+33 6 00 00 00 00', true, false, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Vérification rapide
SELECT 
    'UTILISATEURS CRÉÉS' as type,
    COUNT(*) as nombre
FROM users 
WHERE username IN ('admin_zishop', 'hotel_test', 'merchant_test')

UNION ALL

SELECT 
    'CLIENTS CRÉÉS' as type,
    COUNT(*) as nombre
FROM clients 
WHERE email = 'test.client@email.com';

-- Identifiants de test
SELECT 
    'IDENTIFIANTS DE TEST' as titre,
    'admin_zishop / admin123' as admin,
    'hotel_test / hotel123' as hotel,
    'merchant_test / merchant123' as merchant,
    'test.client@email.com / client123' as client;
