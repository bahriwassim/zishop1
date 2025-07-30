// Test complet : création utilisateur + commande
const testOrderWithUser = async () => {
  console.log("🧪 Test complet : création utilisateur + commande");
  
  try {
    // 1. Créer un utilisateur
    console.log("1. Création d'utilisateur...");
    const registerResponse = await fetch('http://localhost:5000/api/clients/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "testorder4@example.com",
        password: "password123",
        first_name: "Test",
        last_name: "Order",
        phone: "06 12 34 56 78"
      })
    });
    
    if (!registerResponse.ok) {
      const error = await registerResponse.text();
      console.error("❌ Erreur création utilisateur:", error);
      return;
    }
    
    const clientData = await registerResponse.json();
    console.log("✅ Utilisateur créé, ID:", clientData.id);
    
    // 2. Se connecter
    console.log("2. Connexion...");
    const loginResponse = await fetch('http://localhost:5000/api/clients/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "testorder4@example.com",
        password: "password123"
      })
    });
    
    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.error("❌ Erreur de connexion:", error);
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log("✅ Connexion réussie, client ID:", loginData.client.id);
    
    // 3. Vérifier les produits
    console.log("3. Vérification des produits...");
    const productsResponse = await fetch('http://localhost:5000/api/products');
    const products = await productsResponse.json();
    
    if (products.length === 0) {
      console.error("❌ Aucun produit disponible");
      return;
    }
    
    const firstProduct = products[0];
    console.log("Premier produit:", firstProduct.name, "ID:", firstProduct.id, "Merchant ID:", firstProduct.merchant_id);
    
    // 4. Créer une commande avec les données exactes
    console.log("4. Création de commande...");
    const orderData = {
      hotel_id: 1,
      merchant_id: firstProduct.merchant_id || 1,
      client_id: loginData.client.id,
      customer_name: "Test User",
      customer_room: "101",
      items: [
        {
          productId: firstProduct.id,
          quantity: 1,
          price: firstProduct.price,
          name: firstProduct.name
        }
      ],
      total_amount: firstProduct.price.toString()
    };
    
    console.log("Données de commande:", JSON.stringify(orderData, null, 2));
    
    const orderResponse = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    
    console.log("Status de la réponse:", orderResponse.status);
    
    if (orderResponse.ok) {
      const order = await orderResponse.json();
      console.log("✅ Commande créée avec succès!");
      console.log("Numéro:", order.order_number);
      console.log("Statut:", order.status);
      console.log("Montant:", order.total_amount);
    } else {
      const error = await orderResponse.text();
      console.error("❌ Erreur création commande:", orderResponse.status);
      console.error("Détails:", error);
    }
    
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
};

testOrderWithUser(); 