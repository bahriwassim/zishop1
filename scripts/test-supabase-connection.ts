import postgres from 'postgres';

async function testSupabaseConnection() {
  console.log("🔌 Test de connexion Supabase...");

  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsYm9icWhtaXZ2YnB2dXFtY29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODcxNDAsImV4cCI6MjA2ODc2MzE0MH0.iGyifmEihWi_C0HeAfrSfatxAVSRLYEo-GvGtMUkcqo";

  // Test 1: Configuration avec sslmode=require
  console.log("\n1. Test avec sslmode=require...");
  try {
    const connectionString1 = `postgresql://postgres.dlbobqhmivvbpvuqmcoo:${supabaseKey}@db.dlbobqhmivvbpvuqmcoo.supabase.co:5432/postgres?sslmode=require`;
    const client1 = postgres(connectionString1, {
      ssl: 'require',
      max: 1,
      connect_timeout: 10
    });
    
    const result1 = await client1`SELECT 1 as test`;
    console.log("✅ Connexion réussie avec sslmode=require");
    console.log("Résultat:", result1);
    await client1.end();
  } catch (error) {
    console.log("❌ Échec avec sslmode=require:", error.message);
  }

  // Test 2: Configuration sans sslmode
  console.log("\n2. Test sans sslmode...");
  try {
    const connectionString2 = `postgresql://postgres.dlbobqhmivvbpvuqmcoo:${supabaseKey}@db.dlbobqhmivvbpvuqmcoo.supabase.co:5432/postgres`;
    const client2 = postgres(connectionString2, {
      ssl: 'require',
      max: 1,
      connect_timeout: 10
    });
    
    const result2 = await client2`SELECT 1 as test`;
    console.log("✅ Connexion réussie sans sslmode");
    console.log("Résultat:", result2);
    await client2.end();
  } catch (error) {
    console.log("❌ Échec sans sslmode:", error.message);
  }

  // Test 3: Configuration avec IPv4 forcé
  console.log("\n3. Test avec IPv4 forcé...");
  try {
    const connectionString3 = `postgresql://postgres.dlbobqhmivvbpvuqmcoo:${supabaseKey}@db.dlbobqhmivvbpvuqmcoo.supabase.co:5432/postgres?sslmode=require&family=4`;
    const client3 = postgres(connectionString3, {
      ssl: 'require',
      max: 1,
      connect_timeout: 10
    });
    
    const result3 = await client3`SELECT 1 as test`;
    console.log("✅ Connexion réussie avec IPv4 forcé");
    console.log("Résultat:", result3);
    await client3.end();
  } catch (error) {
    console.log("❌ Échec avec IPv4 forcé:", error.message);
  }

  // Test 4: Configuration alternative
  console.log("\n4. Test avec configuration alternative...");
  try {
    const connectionString4 = `postgresql://postgres.dlbobqhmivvbpvuqmcoo:${supabaseKey}@db.dlbobqhmivvbpvuqmcoo.supabase.co:5432/postgres?sslmode=require&connect_timeout=10`;
    const client4 = postgres(connectionString4, {
      ssl: 'require',
      max: 1,
      connect_timeout: 10,
      connection: {
        application_name: 'zishop-test'
      }
    });
    
    const result4 = await client4`SELECT 1 as test`;
    console.log("✅ Connexion réussie avec configuration alternative");
    console.log("Résultat:", result4);
    await client4.end();
  } catch (error) {
    console.log("❌ Échec avec configuration alternative:", error.message);
  }

  console.log("\n🎉 Tests de connexion terminés !");
}

// Exécuter le test si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  testSupabaseConnection()
    .then(() => {
      console.log("✅ Tests de connexion terminés avec succès !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Tests de connexion échoués:", error);
      process.exit(1);
    });
}

export { testSupabaseConnection };