// Test pour créer des commandes avec différents statuts que l'hôtel peut gérer
console.log("🚀 Création de commandes pour test de livraison...");

const API_BASE = "http://localhost:5000/api";

async function createDeliveryTestData() {
  try {
    console.log("📦 Création des commandes de test...");

    // Commande 1: En livraison (peut être marquée comme reçue)
    const order1 = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotel_id: 1,
        merchant_id: 1,
        customer_name: "Sophie Bernard",
        customer_room: "205",
        customer_phone: "+33 6 12 34 56 78",
        items: [
          {
            product_id: 1,
            product_name: "Tour Eiffel Miniature",
            quantity: 2,
            price: "12.50"
          },
          {
            product_id: 2,
            product_name: "Magnet Paris",
            quantity: 1,
            price: "4.90"
          }
        ],
        total_amount: "29.90",
        status: "delivering", // Prêt pour réception hôtel
        order_number: `ZI${Date.now().toString().slice(-6)}`,
        delivery_notes: "Livraison en cours vers l'hôtel"
      })
    });

    // Commande 2: Livrée à l'hôtel (peut être marquée comme remise au client)
    const order2 = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotel_id: 1,
        merchant_id: 1,
        customer_name: "Marie Martin",
        customer_room: "312",
        customer_phone: "+33 6 98 76 54 32",
        items: [
          {
            product_id: 3,
            product_name: "Artisanat Local",
            quantity: 1,
            price: "24.90"
          }
        ],
        total_amount: "24.90",
        status: "delivered", // Livrée à l'hôtel
        order_number: `ZI${Date.now().toString().slice(-5)}`,
        delivery_notes: "Livré à la réception",
        delivered_at: new Date().toISOString(),
        picked_up: false // Pas encore remis au client
      })
    });

    // Commande 3: En préparation (pour test commerçant)
    const order3 = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotel_id: 1,
        merchant_id: 1,
        customer_name: "Jean Dupont",
        customer_room: "108",
        customer_phone: "+33 6 11 22 33 44",
        items: [
          {
            product_id: 1,
            product_name: "Tour Eiffel Miniature",
            quantity: 1,
            price: "12.50"
          }
        ],
        total_amount: "12.50",
        status: "preparing", // En préparation
        order_number: `ZI${Date.now().toString().slice(-4)}`,
        confirmed_at: new Date().toISOString()
      })
    });

    const results = await Promise.all([order1, order2, order3]);
    const orders = await Promise.all(results.map(r => r.json()));

    console.log("✅ Commandes créées avec succès:");
    orders.forEach((order, index) => {
      console.log(`   ${index + 1}. Commande #${order.order_number} - ${order.status}`);
      console.log(`      Client: ${order.customer_name} - Chambre ${order.customer_room}`);
      console.log(`      Total: €${order.total_amount}`);
      
      if (order.status === "delivering") {
        console.log("      🚚 Cette commande peut être marquée comme 'Réception confirmée' par l'hôtel");
      }
      if (order.status === "delivered" && !order.picked_up) {
        console.log("      📋 Cette commande peut être marquée comme 'Remis au client' par l'hôtel");
      }
      if (order.status === "preparing") {
        console.log("      👨‍🍳 Cette commande peut être passée à 'Prêt pour livraison' par le commerçant");
      }
      console.log("");
    });

    console.log("📋 Instructions pour tester:");
    console.log("1. Ouvrez le Dashboard Hôtel");
    console.log("2. Allez dans 'Commandes clients'");
    console.log("3. Vous verrez les commandes avec boutons d'action:");
    console.log("   - 'Réception confirmée' pour les commandes en livraison");
    console.log("   - 'Remis au client' pour les commandes livrées à l'hôtel");
    console.log("");
    console.log("🎯 Pour tester la persistance:");
    console.log("1. Testez en mode navigation normale (pas privée)");
    console.log("2. Les données sont sauvegardées dans Supabase");
    console.log("3. Fermez et rouvrez le navigateur pour vérifier la persistance");

  } catch (error) {
    console.error("❌ Erreur lors de la création des commandes:", error);
  }
}

// Lancer le test
createDeliveryTestData();