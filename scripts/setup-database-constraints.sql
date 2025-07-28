-- Script de configuration des contraintes de clés étrangères pour Supabase
-- Ce script s'assure que toutes les contraintes sont correctement définies

-- 1. Contrainte hotel_merchants_hotel_id_fkey
-- Vérifier si la contrainte existe, sinon la créer
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hotel_merchants_hotel_id_fkey' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE hotel_merchants 
        ADD CONSTRAINT hotel_merchants_hotel_id_fkey 
        FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE;
        RAISE NOTICE 'Contrainte hotel_merchants_hotel_id_fkey créée';
    ELSE
        RAISE NOTICE 'Contrainte hotel_merchants_hotel_id_fkey existe déjà';
    END IF;
END $$;

-- 2. Contrainte hotel_merchants_merchant_id_fkey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hotel_merchants_merchant_id_fkey' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE hotel_merchants 
        ADD CONSTRAINT hotel_merchants_merchant_id_fkey 
        FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE;
        RAISE NOTICE 'Contrainte hotel_merchants_merchant_id_fkey créée';
    ELSE
        RAISE NOTICE 'Contrainte hotel_merchants_merchant_id_fkey existe déjà';
    END IF;
END $$;

-- 3. Contrainte orders_client_id_fkey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'orders_client_id_fkey' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE orders 
        ADD CONSTRAINT orders_client_id_fkey 
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;
        RAISE NOTICE 'Contrainte orders_client_id_fkey créée';
    ELSE
        RAISE NOTICE 'Contrainte orders_client_id_fkey existe déjà';
    END IF;
END $$;

-- 4. Contrainte orders_merchant_id_fkey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'orders_merchant_id_fkey' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE orders 
        ADD CONSTRAINT orders_merchant_id_fkey 
        FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE;
        RAISE NOTICE 'Contrainte orders_merchant_id_fkey créée';
    ELSE
        RAISE NOTICE 'Contrainte orders_merchant_id_fkey existe déjà';
    END IF;
END $$;

-- 5. Contrainte orders_hotel_id_fkey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'orders_hotel_id_fkey' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE orders 
        ADD CONSTRAINT orders_hotel_id_fkey 
        FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE;
        RAISE NOTICE 'Contrainte orders_hotel_id_fkey créée';
    ELSE
        RAISE NOTICE 'Contrainte orders_hotel_id_fkey existe déjà';
    END IF;
END $$;

-- 6. Contrainte products_merchant_id_fkey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'products_merchant_id_fkey' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE products 
        ADD CONSTRAINT products_merchant_id_fkey 
        FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE;
        RAISE NOTICE 'Contrainte products_merchant_id_fkey créée';
    ELSE
        RAISE NOTICE 'Contrainte products_merchant_id_fkey existe déjà';
    END IF;
END $$;

-- 7. Contrainte products_validated_by_fkey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'products_validated_by_fkey' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE products 
        ADD CONSTRAINT products_validated_by_fkey 
        FOREIGN KEY (validated_by) REFERENCES users(id) ON DELETE SET NULL;
        RAISE NOTICE 'Contrainte products_validated_by_fkey créée';
    ELSE
        RAISE NOTICE 'Contrainte products_validated_by_fkey existe déjà';
    END IF;
END $$;

-- Vérification finale des contraintes
SELECT 
    tc.constraint_name,
    tc.table_schema,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
    AND tc.constraint_name IN (
        'hotel_merchants_hotel_id_fkey',
        'hotel_merchants_merchant_id_fkey',
        'orders_client_id_fkey',
        'orders_merchant_id_fkey',
        'orders_hotel_id_fkey',
        'products_merchant_id_fkey',
        'products_validated_by_fkey'
    )
ORDER BY tc.constraint_name;