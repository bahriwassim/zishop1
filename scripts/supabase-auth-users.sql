-- =====================================================
-- GÉNÉRATEUR D'UTILISATEURS AVEC SUPABASE AUTH
-- Application ZiShop - Authentification Complète
-- =====================================================

-- IMPORTANT: Ce script doit être exécuté dans l'éditeur SQL de Supabase
-- Les mots de passe sont hashés avec bcrypt et compatibles Supabase

-- 1. CRÉATION DES UTILISATEURS SYSTÈME
-- =====================================================

-- Admin principal
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin_zishop@zishop.local',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"username":"admin_zishop","role":"admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Hôtels
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES 
    (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'hotel_novotel@zishop.local',
        crypt('hotel123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"username":"hotel_novotel_vaugirard","role":"hotel","entity_id":1}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'hotel_mercure@zishop.local',
        crypt('hotel123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"username":"hotel_mercure_boulogne","role":"hotel","entity_id":2}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    );

-- Marchands
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES 
    (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'merchant_boulangerie@zishop.local',
        crypt('merchant123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"username":"merchant_boulangerie","role":"merchant","entity_id":1}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'merchant_souvenirs@zishop.local',
        crypt('merchant123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"username":"merchant_souvenirs","role":"merchant","entity_id":2}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    );

-- 2. CRÉATION DES PROFILS UTILISATEURS
-- =====================================================

-- Créer la table profiles si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    entity_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer les profils des utilisateurs système
INSERT INTO public.profiles (id, username, role, entity_id)
SELECT 
    u.id,
    u.raw_user_meta_data->>'username' as username,
    u.raw_user_meta_data->>'role' as role,
    (u.raw_user_meta_data->>'entity_id')::INTEGER as entity_id
FROM auth.users u
WHERE u.email LIKE '%@zishop.local'
ON CONFLICT (username) DO NOTHING;

-- 3. CRÉATION DES CLIENTS DE TEST
-- =====================================================

-- Clients avec authentification Supabase
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES 
    (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'jean.dupont@email.com',
        crypt('client123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"first_name":"Jean","last_name":"Dupont","phone":"+33 6 12 34 56 78"}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'marie.martin@email.com',
        crypt('client123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"first_name":"Marie","last_name":"Martin","phone":"+33 6 23 45 67 89"}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'pierre.durand@email.com',
        crypt('client123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"first_name":"Pierre","last_name":"Durand","phone":"+33 6 34 56 78 90"}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    );

-- 4. CRÉATION DES PROFILS CLIENTS
-- =====================================================

-- Créer la table client_profiles si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.client_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    has_completed_tutorial BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer les profils clients
INSERT INTO public.client_profiles (id, first_name, last_name, phone)
SELECT 
    u.id,
    u.raw_user_meta_data->>'first_name' as first_name,
    u.raw_user_meta_data->>'last_name' as last_name,
    u.raw_user_meta_data->>'phone' as phone
FROM auth.users u
WHERE u.email LIKE '%@email.com'
ON CONFLICT (id) DO NOTHING;

-- 5. VÉRIFICATION ET RÉCAPITULATIF
-- =====================================================

-- Compter les utilisateurs créés
SELECT 
    'UTILISATEURS SYSTÈME' as type,
    COUNT(*) as nombre
FROM public.profiles
WHERE role IN ('admin', 'hotel', 'merchant')

UNION ALL

SELECT 
    'CLIENTS' as type,
    COUNT(*) as nombre
FROM public.client_profiles;

-- Afficher les identifiants de connexion
SELECT 
    'IDENTIFIANTS DE CONNEXION' as titre,
    'Utilisez ces emails et mots de passe pour vous connecter' as description;

-- Identifiants des utilisateurs système
SELECT 
    'UTILISATEURS SYSTÈME' as categorie,
    p.username as username,
    u.email as email,
    'Voir tableau ci-dessous' as mot_de_passe,
    p.role as role
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.role, p.username;

-- Identifiants des clients
SELECT 
    'CLIENTS' as categorie,
    u.email as email,
    'Voir tableau ci-dessous' as mot_de_passe,
    cp.first_name || ' ' || cp.last_name as nom_complet,
    cp.phone as telephone
FROM public.client_profiles cp
JOIN auth.users u ON cp.id = u.id
ORDER BY cp.first_name;

-- 6. TABLEAU DES MOTS DE PASSE
-- =====================================================

SELECT 
    'MOTS DE PASSE DE TEST' as titre,
    'Ces mots de passe sont hashés et sécurisés' as description;

-- Mots de passe des utilisateurs système
SELECT 
    'admin_zishop@zishop.local' as email,
    'admin123' as password,
    'Admin principal' as description

UNION ALL

SELECT 
    'hotel_novotel@zishop.local' as email,
    'hotel123' as password,
    'Gestionnaire hôtel Novotel' as description

UNION ALL

SELECT 
    'hotel_mercure@zishop.local' as email,
    'hotel123' as password,
    'Gestionnaire hôtel Mercure' as description

UNION ALL

SELECT 
    'merchant_boulangerie@zishop.local' as email,
    'merchant123' as password,
    'Boulangerie Montparnasse' as description

UNION ALL

SELECT 
    'merchant_souvenirs@zishop.local' as email,
    'merchant123' as password,
    'Boutique souvenirs Tour Eiffel' as description

UNION ALL

SELECT 
    'jean.dupont@email.com' as email,
    'client123' as password,
    'Client Jean Dupont' as description

UNION ALL

SELECT 
    'marie.martin@email.com' as email,
    'client123' as password,
    'Client Marie Martin' as description

UNION ALL

SELECT 
    'pierre.durand@email.com' as email,
    'client123' as password,
    'Client Pierre Durand' as description

ORDER BY description;

-- 7. POLITIQUES RLS RECOMMANDÉES
-- =====================================================

-- Activer RLS sur les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour les profils utilisateurs
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Politique pour les profils clients
CREATE POLICY "Clients can view their own profile" ON public.client_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all client profiles" ON public.client_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 8. SCRIPT DE NETTOYAGE (OPTIONNEL)
-- =====================================================

-- Décommentez et exécutez ces lignes pour nettoyer
/*
-- Supprimer les profils clients
DELETE FROM public.client_profiles;

-- Supprimer les profils utilisateurs
DELETE FROM public.profiles;

-- Supprimer les utilisateurs auth
DELETE FROM auth.users WHERE email LIKE '%@zishop.local';
DELETE FROM auth.users WHERE email LIKE '%@email.com';

-- Vérifier le nettoyage
SELECT 'NETTOYAGE TERMINÉ' as status;
*/
