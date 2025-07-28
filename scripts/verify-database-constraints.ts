import { db } from "../server/storage";
import { sql } from "drizzle-orm";

const expectedConstraints = [
  {
    "constraint_name": "hotel_merchants_hotel_id_fkey",
    "table_schema": "public",
    "source_table": "hotel_merchants",
    "source_column": "hotel_id",
    "target_table": "hotels",
    "target_column": "id"
  },
  {
    "constraint_name": "hotel_merchants_merchant_id_fkey",
    "table_schema": "public",
    "source_table": "hotel_merchants",
    "source_column": "merchant_id",
    "target_table": "merchants",
    "target_column": "id"
  },
  {
    "constraint_name": "orders_client_id_fkey",
    "table_schema": "public",
    "source_table": "orders",
    "source_column": "client_id",
    "target_table": "clients",
    "target_column": "id"
  },
  {
    "constraint_name": "orders_merchant_id_fkey",
    "table_schema": "public",
    "source_table": "orders",
    "source_column": "merchant_id",
    "target_table": "merchants",
    "target_column": "id"
  },
  {
    "constraint_name": "orders_hotel_id_fkey",
    "table_schema": "public",
    "source_table": "orders",
    "source_column": "hotel_id",
    "target_table": "hotels",
    "target_column": "id"
  },
  {
    "constraint_name": "products_merchant_id_fkey",
    "table_schema": "public",
    "source_table": "products",
    "source_column": "merchant_id",
    "target_table": "merchants",
    "target_column": "id"
  },
  {
    "constraint_name": "products_validated_by_fkey",
    "table_schema": "public",
    "source_table": "products",
    "source_column": "validated_by",
    "target_table": "users",
    "target_column": "id"
  }
];

async function verifyDatabaseConstraints() {
  console.log("🔍 Vérification des contraintes de base de données...");

  try {
    // Récupérer les contraintes existantes
    const existingConstraints = await db.execute(sql`
      SELECT 
        tc.constraint_name,
        tc.table_schema,
        tc.table_name as source_table,
        kcu.column_name as source_column,
        ccu.table_name as target_table,
        ccu.column_name as target_column
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name
    `);

    console.log("\n📋 Contraintes existantes:");
    existingConstraints.forEach((constraint: any) => {
      console.log(`  - ${constraint.constraint_name}: ${constraint.source_table}.${constraint.source_column} -> ${constraint.target_table}.${constraint.target_column}`);
    });

    // Vérifier si toutes les contraintes attendues existent
    const missingConstraints = expectedConstraints.filter(expected => {
      return !existingConstraints.some((existing: any) => 
        existing.constraint_name === expected.constraint_name
      );
    });

    if (missingConstraints.length > 0) {
      console.log("\n❌ Contraintes manquantes:");
      missingConstraints.forEach(constraint => {
        console.log(`  - ${constraint.constraint_name}: ${constraint.source_table}.${constraint.source_column} -> ${constraint.target_table}.${constraint.target_column}`);
      });

      console.log("\n🔧 Création des contraintes manquantes...");
      
      for (const constraint of missingConstraints) {
        try {
          await db.execute(sql.unsafe(`
            ALTER TABLE ${constraint.source_table} 
            ADD CONSTRAINT ${constraint.constraint_name} 
            FOREIGN KEY (${constraint.source_column}) 
            REFERENCES ${constraint.target_table}(${constraint.target_column})
            ON DELETE ${constraint.source_column === 'validated_by' ? 'SET NULL' : 'CASCADE'}
          `));
          console.log(`  ✅ Contrainte créée: ${constraint.constraint_name}`);
        } catch (error) {
          console.log(`  ❌ Erreur lors de la création de ${constraint.constraint_name}:`, error);
        }
      }
    } else {
      console.log("\n✅ Toutes les contraintes attendues sont présentes !");
    }

    // Vérifier la structure des tables
    console.log("\n📊 Structure des tables:");
    const tables = ['hotels', 'merchants', 'products', 'orders', 'clients', 'users', 'hotel_merchants'];
    
    for (const table of tables) {
      try {
        const columns = await db.execute(sql.unsafe(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = '${table}' 
          AND table_schema = 'public'
          ORDER BY ordinal_position
        `));
        
        console.log(`\n  Table: ${table}`);
        columns.forEach((column: any) => {
          console.log(`    - ${column.column_name}: ${column.data_type} ${column.is_nullable === 'NO' ? 'NOT NULL' : ''} ${column.column_default ? `DEFAULT ${column.column_default}` : ''}`);
        });
      } catch (error) {
        console.log(`  ❌ Erreur lors de la vérification de la table ${table}:`, error);
      }
    }

    console.log("\n🎉 Vérification terminée !");

  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
    throw error;
  }
}

// Exécuter la vérification si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyDatabaseConstraints()
    .then(() => {
      console.log("✅ Vérification terminée avec succès !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Vérification échouée:", error);
      process.exit(1);
    });
}

export { verifyDatabaseConstraints };