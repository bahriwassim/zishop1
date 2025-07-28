import { db } from "../server/storage";
import { sql } from "drizzle-orm";

async function testConnection() {
  console.log("🔌 Test de connexion à la base de données...");

  try {
    // Test simple de connexion
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log("✅ Connexion réussie !");
    console.log("Résultat:", result);

    // Test de récupération des tables
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log("\n📋 Tables disponibles:");
    tables.forEach((table: any) => {
      console.log(`  - ${table.table_name}`);
    });

  } catch (error) {
    console.error("❌ Erreur de connexion:", error);
    throw error;
  }
}

// Exécuter le test si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  testConnection()
    .then(() => {
      console.log("✅ Test de connexion terminé avec succès !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Test de connexion échoué:", error);
      process.exit(1);
    });
}

export { testConnection };