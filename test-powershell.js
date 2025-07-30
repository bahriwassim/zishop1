// Test simple avec Node.js
const testSimple = async () => {
  console.log("🧪 Test simple avec Node.js");
  
  try {
    // Test 1: Vérifier que le serveur répond
    console.log("1. Test de connexion au serveur...");
    const response = await fetch('http://localhost:5000/api/hotels');
    console.log("Status:", response.status);
    
    if (response.ok) {
      const hotels = await response.json();
      console.log("✅ Serveur fonctionne, hôtels trouvés:", hotels.length);
      
      // Test 2: Créer un utilisateur
      console.log("2. Création d'utilisateur...");
      const registerResponse = await fetch('http://localhost:5000/api/clients/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: "testpowershell@example.com",
          password: "password123",
          first_name: "Test",
          last_name: "PowerShell",
          phone: "06 12 34 56 78"
        })
      });
      
      console.log("Register status:", registerResponse.status);
      
      if (registerResponse.ok) {
        const client = await registerResponse.json();
        console.log("✅ Utilisateur créé:", client.id);
        
        // Test 3: Se connecter
        console.log("3. Connexion...");
        const loginResponse = await fetch('http://localhost:5000/api/clients/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: "testpowershell@example.com",
            password: "password123"
          })
        });
        
        console.log("Login status:", loginResponse.status);
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log("✅ Connexion réussie, token obtenu");
          
          // Test 4: Vérifier les produits
          console.log("4. Vérification des produits...");
          const productsResponse = await fetch('http://localhost:5000/api/products');
          const products = await productsResponse.json();
          console.log("Produits disponibles:", products.length);
          
          if (products.length > 0) {
            const product = products[0];
            console.log("Premier produit:", product.name, "ID:", product.id);
            
            // Test 5: Créer une commande
            console.log("5. Test de création de commande...");
            const orderData = {
              hotel_id: 1,
              merchant_id: product.merchant_id || 1,
              client_id: loginData.client.id,
              customer_name: "Test User",
              customer_room: "101",
              items: [{ productId: product.id, quantity: 1 }],
              total_amount: product.price.toString()
            };
            
            console.log("Données de commande:", JSON.stringify(orderData, null, 2));
            
            const orderResponse = await fetch('http://localhost:5000/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
              },
              body: JSON.stringify(orderData)
            });
            
            console.log("Order status:", orderResponse.status);
            
            if (orderResponse.ok) {
              const order = await orderResponse.json();
              console.log("✅ Commande créée avec succès!");
              console.log("Numéro:", order.order_number);
            } else {
              const error = await orderResponse.text();
              console.error("❌ Erreur création commande:", error);
            }
          }
        } else {
          const error = await loginResponse.text();
          console.error("❌ Erreur de connexion:", error);
        }
      } else {
        const error = await registerResponse.text();
        console.error("❌ Erreur création utilisateur:", error);
      }
    } else {
      console.error("❌ Serveur ne répond pas");
    }
    
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
};

testSimple(); 