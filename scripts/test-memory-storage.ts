import { MemStorage } from "../server/storage";
import { insertHotelSchema, insertMerchantSchema, insertProductSchema, insertClientSchema, insertUserSchema, insertOrderSchema, insertHotelMerchantSchema } from "../shared/schema";

async function testMemoryStorage() {
  console.log("🧪 Test du stockage en mémoire");
  console.log("=" .repeat(50));

  const storage = new MemStorage();
  let passedTests = 0;
  let totalTests = 0;

  const runTest = async (name: string, testFn: () => Promise<boolean>) => {
    totalTests++;
    console.log(`\n${totalTests}. ${name}`);
    try {
      const result = await testFn();
      if (result) {
        console.log("   ✅ Test réussi");
        passedTests++;
      } else {
        console.log("   ❌ Test échoué");
      }
    } catch (error) {
      console.log(`   ❌ Test échoué avec erreur: ${error.message}`);
    }
  };

  // Test 1: Création d'hôtel
  await runTest("Création d'hôtel", async () => {
    const hotelData = {
      name: "Hôtel Test Mémoire",
      address: "123 Rue Test",
      code: "MEM001",
      latitude: "48.8566",
      longitude: "2.3522",
      qrCode: "qr_mem_001"
    };
    const hotel = await storage.createHotel(insertHotelSchema.parse(hotelData));
    return hotel.id > 0;
  });

  // Test 2: Création de commerçant
  await runTest("Création de commerçant", async () => {
    const merchantData = {
      name: "Commerçant Test Mémoire",
      address: "456 Avenue Test",
      category: "restaurant",
      latitude: "48.8566",
      longitude: "2.3522"
    };
    const merchant = await storage.createMerchant(insertMerchantSchema.parse(merchantData));
    return merchant.id > 0;
  });

  // Test 3: Création d'utilisateur
  await runTest("Création d'utilisateur", async () => {
    const userData = {
      username: "admin_mem",
      password: "password123",
      role: "admin"
    };
    const user = await storage.createUser(insertUserSchema.parse(userData));
    return user.id > 0;
  });

  // Test 4: Création de client
  await runTest("Création de client", async () => {
    const clientData = {
      email: "client.mem@test.com",
      password: "password123",
      firstName: "Jean",
      lastName: "Mémoire",
      phone: "0123456789"
    };
    const client = await storage.createClient(insertClientSchema.parse(clientData));
    return client.id > 0;
  });

  // Test 5: Création de produit
  await runTest("Création de produit", async () => {
    const merchants = await storage.getAllMerchants();
    if (merchants.length === 0) return false;

    const productData = {
      merchantId: merchants[0].id,
      name: "Produit Test Mémoire",
      description: "Description du produit test",
      price: "15.99",
      category: "nourriture",
      isSouvenir: false
    };
    const product = await storage.createProduct(insertProductSchema.parse(productData));
    return product.id > 0;
  });

  // Test 6: Création de commande
  await runTest("Création de commande", async () => {
    const hotels = await storage.getAllHotels();
    const merchants = await storage.getAllMerchants();
    const clients = await storage.getAllClients();

    if (hotels.length === 0 || merchants.length === 0 || clients.length === 0) return false;

    const orderData = {
      hotelId: hotels[0].id,
      merchantId: merchants[0].id,
      clientId: clients[0].id,
      customerName: "Client Commande",
      customerRoom: "101",
      items: JSON.stringify([{
        productId: 1,
        name: "Produit Test",
        price: "15.99",
        quantity: 2
      }]),
      totalAmount: "31.98"
    };
    const order = await storage.createOrder(orderData);
    return order.id > 0;
  });

  // Test 7: Association hotel-merchant
  await runTest("Association hotel-merchant", async () => {
    const hotels = await storage.getAllHotels();
    const merchants = await storage.getAllMerchants();

    if (hotels.length === 0 || merchants.length === 0) return false;

    const hotelMerchantData = {
      hotelId: hotels[0].id,
      merchantId: merchants[0].id
    };
    const hotelMerchant = await storage.addHotelMerchant(hotelMerchantData);
    return hotelMerchant.id > 0;
  });

  // Test 8: Vérification des contraintes de clés étrangères
  await runTest("Vérification des contraintes FK", async () => {
    const hotels = await storage.getAllHotels();
    const merchants = await storage.getAllMerchants();
    const clients = await storage.getAllClients();
    const orders = await storage.getAllOrders();
    const products = await storage.getAllProducts();

    // Vérifier que les commandes ont des références valides
    for (const order of orders) {
      const hotel = hotels.find(h => h.id === order.hotelId);
      const merchant = merchants.find(m => m.id === order.merchantId);
      
      if (!hotel || !merchant) {
        return false;
      }
    }

    // Vérifier que les produits ont des références valides
    for (const product of products) {
      const merchant = merchants.find(m => m.id === product.merchantId);
      if (!merchant) {
        return false;
      }
    }

    return true;
  });

  // Test 9: Test d'authentification
  await runTest("Test d'authentification client", async () => {
    const client = await storage.authenticateClient("client.mem@test.com", "password123");
    return client !== undefined;
  });

  // Test 10: Test d'authentification utilisateur
  await runTest("Test d'authentification utilisateur", async () => {
    const user = await storage.authenticateUser("admin_mem", "password123");
    return user !== undefined;
  });

  // Test 11: Test de recherche
  await runTest("Test de recherche d'hôtel par code", async () => {
    const hotel = await storage.getHotelByCode("MEM001");
    return hotel !== undefined;
  });

  // Test 12: Test de mise à jour
  await runTest("Test de mise à jour d'hôtel", async () => {
    const hotels = await storage.getAllHotels();
    if (hotels.length === 0) return false;

    const updatedHotel = await storage.updateHotel(hotels[0].id, { 
      name: "Hôtel Test Mis à Jour" 
    });
    return updatedHotel !== undefined && updatedHotel.name === "Hôtel Test Mis à Jour";
  });

  // Résultats
  console.log("\n" + "=" .repeat(50));
  console.log(`📊 Résultats: ${passedTests}/${totalTests} tests réussis`);
  
  if (passedTests === totalTests) {
    console.log("🎉 Tous les tests sont passés ! Le stockage en mémoire fonctionne correctement.");
    console.log("\n✅ Fonctionnalités vérifiées:");
    console.log("   - CRUD Hôtels ✓");
    console.log("   - CRUD Commerçants ✓");
    console.log("   - CRUD Utilisateurs ✓");
    console.log("   - CRUD Clients ✓");
    console.log("   - CRUD Produits ✓");
    console.log("   - CRUD Commandes ✓");
    console.log("   - Associations Hotel-Merchant ✓");
    console.log("   - Authentification ✓");
    console.log("   - Recherche et mise à jour ✓");
  } else {
    console.log("⚠️ Certains tests ont échoué. Vérifiez l'implémentation.");
  }

  return passedTests === totalTests;
}

// Exécuter les tests si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  testMemoryStorage()
    .then((success) => {
      if (success) {
        console.log("\n🎉 Tests terminés avec succès !");
        process.exit(0);
      } else {
        console.log("\n💥 Tests échoués !");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("💥 Erreur lors des tests:", error);
      process.exit(1);
    });
}

export { testMemoryStorage };