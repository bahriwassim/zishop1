// Test de création de commande
const testCreateOrder = async () => {
  console.log("🧪 Test de création de commande");
  
  try {
    // 1. D'abord, se connecter pour obtenir un token
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
    console.log("✅ Connexion réussie, token obtenu");
    
    // 2. Créer une commande de test
    console.log("2. Création de commande...");
    const orderData = {
      hotelId: 1,
      merchantId: 1,
      clientId: loginData.client.id,
      customerName: "Test User",
      customerRoom: "101",
      items: [
        {
          productId: 1,
          quantity: 2
        }
      ],
      totalAmount: "25.00"
    };
    
    const orderResponse = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    
    if (orderResponse.ok) {
      const order = await orderResponse.json();
      console.log("✅ Commande créée:", order.orderNumber);
      console.log("Statut:", order.status);
      console.log("Montant:", order.totalAmount);
    } else {
      const error = await orderResponse.text();
      console.error("❌ Erreur création commande:", orderResponse.status);
      console.error("Détails:", error);
    }
    
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
};

testCreateOrder(); 