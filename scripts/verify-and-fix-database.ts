import { storage } from "../server/storage";
import { insertHotelSchema, insertMerchantSchema, insertProductSchema, insertClientSchema, insertUserSchema } from "../shared/schema";

async function verifyAndFixDatabase() {
  console.log("🔍 Vérification et correction de la base de données...");

  try {
    // Vérification 1: Tables existantes
    console.log("\n1. Vérification des tables...");
    
    try {
      const hotels = await storage.getAllHotels();
      console.log(`✅ Table hotels: ${hotels.length} enregistrements`);
    } catch (error) {
      console.log("❌ Table hotels inaccessible:", error.message);
    }

    try {
      const merchants = await storage.getAllMerchants();
      console.log(`✅ Table merchants: ${merchants.length} enregistrements`);
    } catch (error) {
      console.log("❌ Table merchants inaccessible:", error.message);
    }

    try {
      const products = await storage.getAllProducts();
      console.log(`✅ Table products: ${products.length} enregistrements`);
    } catch (error) {
      console.log("❌ Table products inaccessible:", error.message);
    }

    try {
      const orders = await storage.getAllOrders();
      console.log(`✅ Table orders: ${orders.length} enregistrements`);
    } catch (error) {
      console.log("❌ Table orders inaccessible:", error.message);
    }

    try {
      const clients = await storage.getAllClients();
      console.log(`✅ Table clients: ${clients.length} enregistrements`);
    } catch (error) {
      console.log("❌ Table clients inaccessible:", error.message);
    }

    try {
      const users = await storage.getAllUsers();
      console.log(`✅ Table users: ${users.length} enregistrements`);
    } catch (error) {
      console.log("❌ Table users inaccessible:", error.message);
    }

    // Vérification 2: Données de test minimales
    console.log("\n2. Vérification des données de test...");
    
    let testHotel = null;
    let testMerchant = null;
    let testUser = null;
    let testClient = null;

    // Créer un hôtel de test s'il n'existe pas
    try {
      const hotels = await storage.getAllHotels();
      if (hotels.length === 0) {
        console.log("📝 Création d'un hôtel de test...");
        const hotelData = {
          name: "Hôtel Test ZiShop",
          address: "123 Avenue des Tests",
          code: "TEST001",
          latitude: "48.8566",
          longitude: "2.3522",
          qrCode: "qr_test_001"
        };
        const validatedHotel = insertHotelSchema.parse(hotelData);
        testHotel = await storage.createHotel(validatedHotel);
        console.log("✅ Hôtel de test créé:", testHotel.id);
      } else {
        testHotel = hotels[0];
        console.log("✅ Hôtel existant trouvé:", testHotel.id);
      }
    } catch (error) {
      console.log("❌ Erreur lors de la création de l'hôtel:", error.message);
    }

    // Créer un commerçant de test s'il n'existe pas
    try {
      const merchants = await storage.getAllMerchants();
      if (merchants.length === 0) {
        console.log("📝 Création d'un commerçant de test...");
        const merchantData = {
          name: "Restaurant Test",
          address: "456 Rue du Commerce",
          category: "restaurant",
          latitude: "48.8566",
          longitude: "2.3522"
        };
        const validatedMerchant = insertMerchantSchema.parse(merchantData);
        testMerchant = await storage.createMerchant(validatedMerchant);
        console.log("✅ Commerçant de test créé:", testMerchant.id);
      } else {
        testMerchant = merchants[0];
        console.log("✅ Commerçant existant trouvé:", testMerchant.id);
      }
    } catch (error) {
      console.log("❌ Erreur lors de la création du commerçant:", error.message);
    }

    // Créer un utilisateur admin de test s'il n'existe pas
    try {
      const users = await storage.getAllUsers();
      if (users.length === 0) {
        console.log("📝 Création d'un utilisateur admin de test...");
        const userData = {
          username: "admin",
          password: "admin123",
          role: "admin"
        };
        const validatedUser = insertUserSchema.parse(userData);
        testUser = await storage.createUser(validatedUser);
        console.log("✅ Utilisateur admin de test créé:", testUser.id);
      } else {
        testUser = users.find(u => u.role === "admin") || users[0];
        console.log("✅ Utilisateur existant trouvé:", testUser.id);
      }
    } catch (error) {
      console.log("❌ Erreur lors de la création de l'utilisateur:", error.message);
    }

    // Créer un client de test s'il n'existe pas
    try {
      const clients = await storage.getAllClients();
      if (clients.length === 0) {
        console.log("📝 Création d'un client de test...");
        const clientData = {
          email: "client@test.com",
          password: "client123",
          firstName: "Jean",
          lastName: "Test",
          phone: "0123456789"
        };
        const validatedClient = insertClientSchema.parse(clientData);
        testClient = await storage.createClient(validatedClient);
        console.log("✅ Client de test créé:", testClient.id);
      } else {
        testClient = clients[0];
        console.log("✅ Client existant trouvé:", testClient.id);
      }
    } catch (error) {
      console.log("❌ Erreur lors de la création du client:", error.message);
    }

    // Vérification 3: Test des contraintes
    console.log("\n3. Test des contraintes de clés étrangères...");
    
    if (testHotel && testMerchant && testClient) {
      try {
        // Test création d'un produit
        console.log("📝 Test création produit...");
        const productData = {
          merchantId: testMerchant.id,
          name: "Produit Test",
          description: "Description du produit test",
          price: "15.99",
          category: "nourriture",
          isSouvenir: false
        };
        const validatedProduct = insertProductSchema.parse(productData);
        const product = await storage.createProduct(validatedProduct);
        console.log("✅ Produit créé avec succès:", product.id);

        // Test création d'une commande
        console.log("📝 Test création commande...");
        const orderData = {
          hotelId: testHotel.id,
          merchantId: testMerchant.id,
          clientId: testClient.id,
          customerName: "Client Test",
          customerRoom: "101",
          items: JSON.stringify([{
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
          }]),
          totalAmount: "15.99"
        };
        const order = await storage.createOrder(orderData);
        console.log("✅ Commande créée avec succès:", order.id);

        // Test association hotel-merchant
        console.log("📝 Test association hotel-merchant...");
        const hotelMerchantData = {
          hotelId: testHotel.id,
          merchantId: testMerchant.id
        };
        const hotelMerchant = await storage.addHotelMerchant(hotelMerchantData);
        console.log("✅ Association hotel-merchant créée:", hotelMerchant.id);

      } catch (error) {
        console.log("❌ Erreur lors du test des contraintes:", error.message);
      }
    }

    // Vérification 4: Résumé final
    console.log("\n4. Résumé de la vérification...");
    
    const finalHotels = await storage.getAllHotels();
    const finalMerchants = await storage.getAllMerchants();
    const finalProducts = await storage.getAllProducts();
    const finalOrders = await storage.getAllOrders();
    const finalClients = await storage.getAllClients();
    const finalUsers = await storage.getAllUsers();

    console.log(`📊 État final de la base de données:`);
    console.log(`   - Hôtels: ${finalHotels.length}`);
    console.log(`   - Commerçants: ${finalMerchants.length}`);
    console.log(`   - Produits: ${finalProducts.length}`);
    console.log(`   - Commandes: ${finalOrders.length}`);
    console.log(`   - Clients: ${finalClients.length}`);
    console.log(`   - Utilisateurs: ${finalUsers.length}`);

    console.log("\n✅ Vérification et correction terminées avec succès !");
    
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
    throw error;
  }
}

// Exécuter la vérification si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyAndFixDatabase()
    .then(() => {
      console.log("🎉 Vérification terminée avec succès !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Vérification échouée:", error);
      process.exit(1);
    });
}

export { verifyAndFixDatabase }; 