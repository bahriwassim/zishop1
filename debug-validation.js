// Diagnostic complet de la validation des produits
console.log("🔍 DIAGNOSTIC DE LA VALIDATION DES PRODUITS");
console.log("============================================");

const API_BASE = "http://localhost:5000/api";

async function debugValidation() {
  try {
    // 1. Test de connexion au serveur
    console.log("\n1. 🌐 TEST DE CONNEXION AU SERVEUR");
    try {
      const pingResponse = await fetch(`${API_BASE}/products`);
      console.log(`   Status: ${pingResponse.status}`);
      if (pingResponse.ok) {
        const products = await pingResponse.json();
        console.log(`   ✅ Serveur accessible - ${products.length} produits`);
      }
    } catch (error) {
      console.log(`   ❌ Serveur inaccessible: ${error.message}`);
      return;
    }

    // 2. Récupérer les produits
    console.log("\n2. 📦 RÉCUPÉRATION DES PRODUITS");
    const productsResponse = await fetch(`${API_BASE}/products`);
    const products = await productsResponse.json();
    
    if (products.length === 0) {
      console.log("   ⚠️ Aucun produit. Création d'un produit de test...");
      const createResponse = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Produit Test Validation",
          description: "Produit créé pour tester la validation admin",
          price: "15.90",
          category: "Test",
          imageUrl: "https://via.placeholder.com/400",
          merchantId: 1,
          isAvailable: true,
          validation_status: "pending"
        })
      });
      
      if (createResponse.ok) {
        console.log("   ✅ Produit de test créé");
        // Re-récupérer les produits
        const newProductsResponse = await fetch(`${API_BASE}/products`);
        const newProducts = await newProductsResponse.json();
        console.log(`   📦 ${newProducts.length} produit(s) disponible(s)`);
      }
    } else {
      console.log(`   ✅ ${products.length} produit(s) trouvé(s)`);
    }

    // 3. Test de l'endpoint de validation SANS authentification
    console.log("\n3. 🔓 TEST VALIDATION SANS AUTH");
    const testProduct = products[0] || (await fetch(`${API_BASE}/products`).then(r => r.json()))[0];
    
    if (testProduct) {
      console.log(`   Produit test: "${testProduct.name}" (ID: ${testProduct.id})`);
      
      const noAuthResponse = await fetch(`${API_BASE}/products/${testProduct.id}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          note: 'Test sans authentification'
        })
      });
      
      console.log(`   Status sans auth: ${noAuthResponse.status}`);
      const noAuthResult = await noAuthResponse.text();
      console.log(`   Réponse: ${noAuthResult}`);
    }

    // 4. Test avec token d'authentification
    console.log("\n4. 🔐 TEST VALIDATION AVEC AUTH");
    if (testProduct) {
      const withAuthResponse = await fetch(`${API_BASE}/products/${testProduct.id}/validate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-test-token'
        },
        body: JSON.stringify({
          action: 'approve',
          note: 'Test avec authentification'
        })
      });
      
      console.log(`   Status avec auth: ${withAuthResponse.status}`);
      const withAuthResult = await withAuthResponse.text();
      console.log(`   Réponse: ${withAuthResult}`);
    }

    // 5. Test de l'authentification admin
    console.log("\n5. 👑 TEST AUTHENTIFICATION ADMIN");
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin'
      })
    });
    
    console.log(`   Status login: ${loginResponse.status}`);
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log(`   ✅ Login réussi: ${JSON.stringify(loginData)}`);
      
      // Test avec le vrai token
      if (loginData.token && testProduct) {
        console.log("\n6. 🎯 TEST VALIDATION AVEC VRAI TOKEN");
        const realTokenResponse = await fetch(`${API_BASE}/products/${testProduct.id}/validate`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
          },
          body: JSON.stringify({
            action: 'approve',
            note: 'Test avec vrai token admin'
          })
        });
        
        console.log(`   Status avec vrai token: ${realTokenResponse.status}`);
        const realTokenResult = await realTokenResponse.text();
        console.log(`   Réponse: ${realTokenResult}`);
      }
    } else {
      const loginError = await loginResponse.text();
      console.log(`   ❌ Erreur login: ${loginError}`);
    }

    // 6. Vérifier les routes disponibles
    console.log("\n7. 🛣️ VÉRIFICATION DES ROUTES");
    const routes = [
      '/products',
      '/products/1/validate',
      '/auth/login'
    ];
    
    for (const route of routes) {
      try {
        const response = await fetch(`${API_BASE}${route}`, {
          method: route.includes('validate') ? 'POST' : 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: route.includes('validate') ? JSON.stringify({action: 'approve'}) : undefined
        });
        console.log(`   ${route}: ${response.status}`);
      } catch (error) {
        console.log(`   ${route}: ERREUR - ${error.message}`);
      }
    }

  } catch (error) {
    console.error("\n❌ ERREUR GÉNÉRALE:", error);
  }
}

console.log("Démarrage du diagnostic...\n");
debugValidation().then(() => {
  console.log("\n🏁 DIAGNOSTIC TERMINÉ");
  console.log("\nℹ️ Si vous voyez des erreurs 401/403, le problème est l'authentification");
  console.log("ℹ️ Si vous voyez des erreurs 404, la route n'existe pas");
  console.log("ℹ️ Si vous voyez des erreurs 500, il y a un problème serveur");
});