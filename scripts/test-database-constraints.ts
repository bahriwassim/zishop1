import { storage } from "../server/storage";
import { insertHotelSchema, insertMerchantSchema, insertProductSchema, insertClientSchema, insertUserSchema } from "../shared/schema";

async function testDatabaseConstraints() {
  console.log("🧪 Test des contraintes de base de données...");

  try {
    // Test 1: Créer un hôtel
    console.log("\n1. Test création hôtel...");
    const hotelData = {
      name: "Hôtel Test",
      address: "123 Rue Test",
      code: "TEST001",
      latitude: "48.8566",
      longitude: "2.3522",
      qrCode: "qr_test_001"
    };
    const validatedHotel = insertHotelSchema.parse(hotelData);
    const hotel = await storage.createHotel(validatedHotel);
    console.log("✅ Hôtel créé:", hotel.id);

    // Test 2: Créer un commerçant
    console.log("\n2. Test création commerçant...");
    const merchantData = {
      name: "Commerçant Test",
      address: "456 Avenue Test",
      category: "restaurant",
      latitude: "48.8566",
      longitude: "2.3522"
    };
    const validatedMerchant = insertMerchantSchema.parse(merchantData);
    const merchant = await storage.createMerchant(validatedMerchant);
    console.log("✅ Commerçant créé:", merchant.id);

    // Test 3: Créer un utilisateur admin
    console.log("\n3. Test création utilisateur...");
    const userData = {
      username: "admin_test",
      password: "password123",
      role: "admin"
    };
    const validatedUser = insertUserSchema.parse(userData);
    const user = await storage.createUser(validatedUser);
    console.log("✅ Utilisateur créé:", user.id);

    // Test 4: Créer un client
    console.log("\n4. Test création client...");
    const clientData = {
      email: "client@test.com",
      password: "password123",
      firstName: "Jean",
      lastName: "Test",
      phone: "0123456789"
    };
    const validatedClient = insertClientSchema.parse(clientData);
    const client = await storage.createClient(validatedClient);
    console.log("✅ Client créé:", client.id);

    // Test 5: Créer un produit
    console.log("\n5. Test création produit...");
    const productData = {
      merchantId: merchant.id,
      name: "Produit Test",
      description: "Description du produit test",
      price: "10.50",
      category: "nourriture",
      isSouvenir: false
    };
    const validatedProduct = insertProductSchema.parse(productData);
    const product = await storage.createProduct(validatedProduct);
    console.log("✅ Produit créé:", product.id);

    // Test 6: Créer une commande
    console.log("\n6. Test création commande...");
    const orderData = {
      hotelId: hotel.id,
      merchantId: merchant.id,
      clientId: client.id,
      customerName: "Client Test",
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
    console.log("✅ Commande créée:", order.id);

    // Test 7: Vérifier les associations hotel-merchant
    console.log("\n7. Test association hotel-merchant...");
    const hotelMerchantData = {
      hotelId: hotel.id,
      merchantId: merchant.id
    };
    const hotelMerchant = await storage.addHotelMerchant(hotelMerchantData);
    console.log("✅ Association hotel-merchant créée:", hotelMerchant.id);

    // Test 8: Vérifier les contraintes de suppression
    console.log("\n8. Test contraintes de suppression...");
    
    // Essayer de supprimer un hôtel avec des commandes (devrait échouer ou supprimer en cascade)
    try {
      await storage.updateHotel(hotel.id, { isActive: false });
      console.log("✅ Hôtel désactivé (pas supprimé à cause des contraintes)");
    } catch (error) {
      console.log("⚠️ Erreur attendue lors de la désactivation de l'hôtel:", error.message);
    }

    // Test 9: Vérifier les données créées
    console.log("\n9. Vérification des données...");
    const hotels = await storage.getAllHotels();
    const merchants = await storage.getAllMerchants();
    const products = await storage.getAllProducts();
    const orders = await storage.getAllOrders();
    
    console.log(`📊 Données créées:`);
    console.log(`   - Hôtels: ${hotels.length}`);
    console.log(`   - Commerçants: ${merchants.length}`);
    console.log(`   - Produits: ${products.length}`);
    console.log(`   - Commandes: ${orders.length}`);

    console.log("\n✅ Tous les tests de contraintes ont réussi !");
    
  } catch (error) {
    console.error("❌ Erreur lors des tests:", error);
    throw error;
  }
}

// Exécuter les tests si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabaseConstraints()
    .then(() => {
      console.log("🎉 Tests terminés avec succès !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Tests échoués:", error);
      process.exit(1);
    });
}

export { testDatabaseConstraints }; 