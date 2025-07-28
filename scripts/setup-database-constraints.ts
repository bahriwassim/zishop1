import { db } from "../server/storage";
import fs from 'fs';
import path from 'path';

async function setupDatabaseConstraints() {
  console.log("🔧 Configuration des contraintes de base de données...");

  try {
    // Vérifier si la connexion à la base de données fonctionne
    if (!db) {
      console.log("❌ Pas de connexion à la base de données disponible");
      console.log("🔄 Utilisation du stockage en mémoire");
      return false;
    }

    // Lire le script SQL
    const sqlFilePath = path.join(process.cwd(), 'scripts', 'setup-database-constraints.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log("📝 Exécution du script SQL...");

    // Exécuter le script SQL
    await db.execute(sql`${sqlContent}`);

    console.log("✅ Contraintes configurées avec succès !");

    // Vérifier les contraintes
    console.log("\n🔍 Vérification des contraintes...");
    
    const constraints = await db.execute(sql`
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
      ORDER BY tc.constraint_name
    `);

    console.log("📊 Contraintes trouvées:");
    for (const constraint of constraints) {
      console.log(`   ✅ ${constraint.constraint_name}: ${constraint.table_name}.${constraint.column_name} -> ${constraint.foreign_table_name}.${constraint.foreign_column_name}`);
    }

    if (constraints.length === 7) {
      console.log("\n🎉 Toutes les contraintes sont correctement configurées !");
      return true;
    } else {
      console.log(`\n⚠️ Seulement ${constraints.length}/7 contraintes trouvées`);
      return false;
    }

  } catch (error) {
    console.error("❌ Erreur lors de la configuration des contraintes:", error);
    return false;
  }
}

// Exécuter la configuration si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabaseConstraints()
    .then((success) => {
      if (success) {
        console.log("\n🎉 Configuration terminée avec succès !");
        process.exit(0);
      } else {
        console.log("\n💥 Configuration échouée !");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("💥 Erreur lors de la configuration:", error);
      process.exit(1);
    });
}

export { setupDatabaseConstraints };