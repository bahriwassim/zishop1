// Test avec les données exactes pour la commande
const testOrderExactData = async () => {
  console.log("🧪 Test avec données exactes pour la commande");
  
  try {
    // 1. Se connecter
    console.log("1. Connexion...");
    const loginResponse = await fetch('http://localhost:5000/api/clients/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "bahriwass@gmail.com",
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
    
    // 2. Vérifier les produits
    console.log("2. Vérification des produits...");
    const productsResponse = await fetch('http://localhost:5000/api/products');
    const products = await productsResponse.json();
    
    if (products.length === 0) {
      console.error("❌ Aucun produit disponible");
      return;
    }
    
    const firstProduct = products[0];
    console.log("Premier produit:", firstProduct.name, "ID:", firstProduct.id, "Merchant ID:", firstProduct.merchant_id);
    
    // 3. Créer une commande avec les données exactes
    console.log("3. Création de commande...");
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

testOrderExactData(); 