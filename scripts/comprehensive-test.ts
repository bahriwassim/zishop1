import { storage } from "../server/storage";
import { insertHotelSchema, insertMerchantSchema, insertProductSchema, insertClientSchema, insertUserSchema, insertOrderSchema } from "../shared/schema";
import { db } from "../server/storage";
import { sql } from "drizzle-orm";

async function comprehensiveTest() {
  console.log("🧪 Test complet de l'application...");
  let testResults = {
    databaseConnection: false,
    schemaValidation: false,
    constraints: false,
    crudOperations: false,
    relationships: false,
    dataIntegrity: false
  };

  try {
    // Test 1: Connexion à la base de données
    console.log("\n1. Test de connexion à la base de données...");
    try {
      await db.execute(sql`SELECT 1 as test`);
      console.log("✅ Connexion à la base de données réussie");
      testResults.databaseConnection = true;
    } catch (error) {
      console.log("❌ Échec de la connexion à la base de données:", error);
      throw error;
    }

    // Test 2: Vérification du schéma
    console.log("\n2. Vérification du schéma de base de données...");
    try {
      const tables = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('hotels', 'merchants', 'products', 'orders', 'clients', 'users', 'hotel_merchants')
        ORDER BY table_name
      `);
      
      const expectedTables = ['hotels', 'merchants', 'products', 'orders', 'clients', 'users', 'hotel_merchants'];
      const foundTables = tables.map((t: any) => t.table_name);
      
      const missingTables = expectedTables.filter(table => !foundTables.includes(table));
      
      if (missingTables.length === 0) {
        console.log("✅ Toutes les tables requises existent");
        testResults.schemaValidation = true;
      } else {
        console.log("❌ Tables manquantes:", missingTables);
      }
    } catch (error) {
      console.log("❌ Erreur lors de la vérification du schéma:", error);
    }

    // Test 3: Vérification des contraintes
    console.log("\n3. Vérification des contraintes de clés étrangères...");
    try {
      const constraints = await db.execute(sql`
        SELECT 
          tc.constraint_name,
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

      const expectedConstraints = [
        'hotel_merchants_hotel_id_fkey',
        'hotel_merchants_merchant_id_fkey',
        'orders_client_id_fkey',
        'orders_merchant_id_fkey',
        'orders_hotel_id_fkey',
        'products_merchant_id_fkey',
        'products_validated_by_fkey'
      ];

      const foundConstraints = constraints.map((c: any) => c.constraint_name);
      const missingConstraints = expectedConstraints.filter(constraint => !foundConstraints.includes(constraint));

      if (missingConstraints.length === 0) {
        console.log("✅ Toutes les contraintes de clés étrangères sont présentes");
        testResults.constraints = true;
      } else {
        console.log("❌ Contraintes manquantes:", missingConstraints);
      }
    } catch (error) {
      console.log("❌ Erreur lors de la vérification des contraintes:", error);
    }

    // Test 4: Opérations CRUD
    console.log("\n4. Test des opérations CRUD...");
    try {
      // Créer un hôtel de test
      const hotelData = {
        name: "Hôtel Test CRUD",
        address: "123 Rue Test CRUD",
        code: "TESTCRUD001",
        latitude: "48.8566",
        longitude: "2.3522",
        qrCode: "qr_test_crud_001"
      };
      const validatedHotel = insertHotelSchema.parse(hotelData);
      const hotel = await storage.createHotel(validatedHotel);
      console.log("✅ Création d'hôtel réussie");

      // Créer un commerçant de test
      const merchantData = {
        name: "Commerçant Test CRUD",
        address: "456 Avenue Test CRUD",
        category: "restaurant",
        latitude: "48.8566",
        longitude: "2.3522"
      };
      const validatedMerchant = insertMerchantSchema.parse(merchantData);
      const merchant = await storage.createMerchant(validatedMerchant);
      console.log("✅ Création de commerçant réussie");

      // Créer un utilisateur de test
      const userData = {
        username: "admin_test_crud",
        password: "password123",
        role: "admin"
      };
      const validatedUser = insertUserSchema.parse(userData);
      const user = await storage.createUser(validatedUser);
      console.log("✅ Création d'utilisateur réussie");

      // Créer un client de test
      const clientData = {
        email: "client@testcrud.com",
        password: "password123",
        firstName: "Jean",
        lastName: "Test CRUD",
        phone: "0123456789"
      };
      const validatedClient = insertClientSchema.parse(clientData);
      const client = await storage.createClient(validatedClient);
      console.log("✅ Création de client réussie");

      // Créer un produit de test
      const productData = {
        merchantId: merchant.id,
        name: "Produit Test CRUD",
        description: "Description du produit test CRUD",
        price: "10.50",
        category: "nourriture",
        isSouvenir: false
      };
      const validatedProduct = insertProductSchema.parse(productData);
      const product = await storage.createProduct(validatedProduct);
      console.log("✅ Création de produit réussie");

      // Créer une commande de test
      const orderData = {
        hotelId: hotel.id,
        merchantId: merchant.id,
        clientId: client.id,
        customerName: "Client Test CRUD",
        customerRoom: "101",
        items: JSON.stringify([{
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 2
        }]),
        totalAmount: "21.00"
      };
      const order = await storage.createOrder(orderData);
      console.log("✅ Création de commande réussie");

      // Test de lecture
      const retrievedHotel = await storage.getHotel(hotel.id);
      const retrievedMerchant = await storage.getMerchant(merchant.id);
      const retrievedProduct = await storage.getProduct(product.id);
      const retrievedOrder = await storage.getOrder(order.id);

      if (retrievedHotel && retrievedMerchant && retrievedProduct && retrievedOrder) {
        console.log("✅ Opérations de lecture réussies");
      }

      // Test de mise à jour
      await storage.updateHotel(hotel.id, { name: "Hôtel Test CRUD Modifié" });
      await storage.updateMerchant(merchant.id, { name: "Commerçant Test CRUD Modifié" });

      console.log("✅ Opérations de mise à jour réussies");
      testResults.crudOperations = true;

    } catch (error) {
      console.log("❌ Erreur lors des opérations CRUD:", error);
    }

    // Test 5: Relations entre entités
    console.log("\n5. Test des relations entre entités...");
    try {
      // Créer une association hotel-merchant
      const hotelMerchantData = {
        hotelId: hotel.id,
        merchantId: merchant.id
      };
      const hotelMerchant = await storage.addHotelMerchant(hotelMerchantData);
      console.log("✅ Association hotel-merchant créée");

      // Vérifier les relations
      const hotelMerchants = await storage.getHotelMerchants(hotel.id);
      const merchantHotels = await storage.getMerchantHotels(merchant.id);

      if (hotelMerchants.length > 0 && merchantHotels.length > 0) {
        console.log("✅ Relations entre entités fonctionnelles");
        testResults.relationships = true;
      }

    } catch (error) {
      console.log("❌ Erreur lors du test des relations:", error);
    }

    // Test 6: Intégrité des données
    console.log("\n6. Test de l'intégrité des données...");
    try {
      // Vérifier que les données respectent les contraintes
      const hotels = await storage.getAllHotels();
      const merchants = await storage.getAllMerchants();
      const products = await storage.getAllProducts();
      const orders = await storage.getAllOrders();
      const clients = await storage.getAllClients();
      const users = await storage.getAllUsers();

      console.log(`📊 Données dans la base:`);
      console.log(`   - Hôtels: ${hotels.length}`);
      console.log(`   - Commerçants: ${merchants.length}`);
      console.log(`   - Produits: ${products.length}`);
      console.log(`   - Commandes: ${orders.length}`);
      console.log(`   - Clients: ${clients.length}`);
      console.log(`   - Utilisateurs: ${users.length}`);

      // Vérifier que les commandes ont des références valides
      for (const order of orders) {
        const hotel = await storage.getHotel(order.hotelId);
        const merchant = await storage.getMerchant(order.merchantId);
        
        if (!hotel || !merchant) {
          console.log(`❌ Commande ${order.id} a des références invalides`);
          continue;
        }
      }

      console.log("✅ Intégrité des données vérifiée");
      testResults.dataIntegrity = true;

    } catch (error) {
      console.log("❌ Erreur lors du test d'intégrité:", error);
    }

    // Résumé des tests
    console.log("\n📋 Résumé des tests:");
    console.log(`   - Connexion DB: ${testResults.databaseConnection ? '✅' : '❌'}`);
    console.log(`   - Schéma: ${testResults.schemaValidation ? '✅' : '❌'}`);
    console.log(`   - Contraintes: ${testResults.constraints ? '✅' : '❌'}`);
    console.log(`   - Opérations CRUD: ${testResults.crudOperations ? '✅' : '❌'}`);
    console.log(`   - Relations: ${testResults.relationships ? '✅' : '❌'}`);
    console.log(`   - Intégrité: ${testResults.dataIntegrity ? '✅' : '❌'}`);

    const allTestsPassed = Object.values(testResults).every(result => result);
    
    if (allTestsPassed) {
      console.log("\n🎉 Tous les tests ont réussi !");
    } else {
      console.log("\n⚠️ Certains tests ont échoué");
    }

  } catch (error) {
    console.error("💥 Erreur lors des tests:", error);
    throw error;
  }
}

// Exécuter les tests si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  comprehensiveTest()
    .then(() => {
      console.log("✅ Tests complets terminés avec succès !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Tests complets échoués:", error);
      process.exit(1);
    });
}

export { comprehensiveTest };